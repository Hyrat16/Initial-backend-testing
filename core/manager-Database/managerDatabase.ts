import { UUID } from "crypto";
import * as fs from "fs";
import * as path from "path";
import { MotorcycleOutput } from "../types/typeCreateUser";
import { DeliverymenOutput } from "../types/typeCreateUser";
import { RentalInput } from "../types/typeCreateUser";

// Tipo de união para as entidades
export type Entity = DeliverymenOutput | RentalInput | MotorcycleOutput;
export type EntityName = "deliverymen" | "rental" | "motorcycle";

// --- Lógica de Gerenciamento de Dados ---

const DATA_DIR = path.join(__dirname, "data");

const dataFiles: Record<EntityName, string> = {
  deliverymen: path.join(DATA_DIR, "deliverymen.json"),
  rental: path.join(DATA_DIR, "rental.json"),
  motorcycle: path.join(DATA_DIR, "motorcycle.json"),
};

// Cache em memória para os dados
const dataCache: Record<EntityName, any[]> = {
  deliverymen: [],
  rental: [],
  motorcycle: [],
};

/**
 * Garante que o diretório de dados e os arquivos existam.
 */
function initializeDataFiles(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
  }

  for (const key in dataFiles) {
    const entityName = key as EntityName;
    if (!fs.existsSync(dataFiles[entityName])) {
      fs.writeFileSync(dataFiles[entityName], JSON.stringify([]), "utf8");
    }
  }
}

/**
 * Carrega os dados de um arquivo para o cache.
 * @param entity - A entidade a ser carregada.
 */
function loadDataToCache(entity: EntityName): void {
  const filePath = dataFiles[entity];
  try {
    const data = fs.readFileSync(filePath, "utf8");
    dataCache[entity] = JSON.parse(data);
  } catch (error) {
    if (
      (error as NodeJS.ErrnoException).code === "ENOENT" ||
      error instanceof SyntaxError
    ) {
      dataCache[entity] = [];
    } else {
      console.error(
        `Erro ao carregar dados de ${entity}:`,
        (error as Error).message,
      );
    }
  }
}

/**
 * Inicia o monitoramento de um arquivo específico.
 * @param entity - A entidade a ser monitorada.
 */
function startWatcher(entity: EntityName): void {
  const filePath = dataFiles[entity];

  // Carrega os dados inicialmente
  loadDataToCache(entity);

  // Cria o watcher
  fs.watch(filePath, (eventType) => {
    if (eventType === "change") {
      setTimeout(() => {
        loadDataToCache(entity);
      }, 100);
    }
  });
}

/**
 * Lê os dados de uma entidade do cache em memória.
 * Os dados são atualizados automaticamente quando o arquivo muda.
 * @param entity - A entidade (deliverymen, rental, motorcycle).
 * @returns O array de dados tipado.
 */
export function readData<T extends Entity>(entity: EntityName): T[] {
  if (!dataFiles[entity]) {
    throw new Error(`Entidade desconhecida: ${entity}`);
  }

  return [...dataCache[entity]] as T[];
}

/**
 * Escreve os dados em um arquivo JSON específico.
 * @param entity - A entidade (deliverymen, rental, motorcycle).
 * @param data - O array de dados a ser escrito.
 */
function writeData(entity: EntityName, data: Entity[]): void {
  const filePath = dataFiles[entity];
  if (!filePath) {
    throw new Error(`Entidade desconhecida: ${entity}`);
  }
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error(
      `Erro ao escrever dados para ${entity}:`,
      (error as Error).message,
    );
    throw error;
  }
}

/**
 * Adiciona um novo item a uma entidade.
 * Atualiza o cache em memória E o arquivo no disco simultaneamente.
 * @param entity - A entidade (deliverymen, rental, motorcycle).
 * @param newItem - O novo item a ser adicionado (sem ID).
 * @returns O item adicionado com um ID.
 */
export function addItem<T extends Omit<Entity, "id">>(
  entity: EntityName,
  newItem: T,
): T {
  //const id = Date.now() + Math.floor(Math.random() * 1000);
  const itemWithId = { ...newItem };

  // Atualiza o cache em memória imediatamente
  dataCache[entity].push(itemWithId);

  // Persiste no disco (o cache já está atualizado)
  writeData(entity, dataCache[entity]);

  return itemWithId;
}

/**
 * Remove um item de uma entidade, atualiza o cache e reescreve o arquivo no disco.
 * @param entity - A entidade (deliverymen, rental, motorcycle).
 * @param id - O identificador do item a ser removido.
 * @returns O array de dados atualizado.
 */
export function removeItem(entity: EntityName, id: string): Entity[] {
  if (!dataFiles[entity]) {
    throw new Error(`Entidade desconhecida: ${entity}`);
  }

  // 1. Pega a lista do cache (que sempre está atualizada)
  const currentList = dataCache[entity] as Entity[];

  // 2. Filtra/Remove o item: Cria uma NOVA lista contendo todos os itens
  // cujo campo 'identifier' NÃO é igual ao 'id' fornecido.
  // Usamos o 'as any' porque o TypeScript pode não saber que
  // TODAS as entidades na união 'Entity' agora possuem 'identifier: string'.
  const updatedList = currentList.filter((d) => {
    // Garantindo que estamos comparando o identifier (string)
    return (d as any).identifier !== id;
  });

  // --- Sua tentativa original (corrigida) ---
  // Você não pode usar .find() para remover.
  // Sua lógica de remoção DEVE ser a do filter acima.
  // ------------------------------------------

  // VERIFICAÇÃO: Se os tamanhos forem iguais, o item não foi encontrado.
  if (updatedList.length === currentList.length) {
    return []; // Você pode optar por lançar um erro ou apenas retornar a lista original aqui.
  }

  // 3. Atualiza o cache em memória
  dataCache[entity] = updatedList;

  // 4. Persiste no disco (reescreve o arquivo JSON com a lista filtrada)
  writeData(entity, updatedList);

  return updatedList;
}

/**
 * Remove um item de uma entidade, atualiza o cache e reescreve o arquivo no disco.
 * @param entity - A entidade (deliverymen, rental, motorcycle).
 * @param id - O identificador do item a ser removido.
 * @returns O array de dados atualizado.
 */
export function UptadeItemId(
  entity: EntityName,
  uptadeItem: any, // Assinatura genérica para aceitar qualquer entidade
): Entity | undefined {
  // 1. Pega a lista do cache
  const currentList = dataCache[entity] as Entity[];

  let wasUpdated = false;

  // 2. Mapeia a lista para criar uma nova lista atualizada (o 'PUT' conceitual)
  const updatedList = currentList.map((item) => {
    // Verifica se o identifier do item atual corresponde ao item de atualização
    if ((item as any).identifier === (uptadeItem as any).identifier) {
      wasUpdated = true;
      return uptadeItem; // Substitui o item antigo pelo item NOVO
    }
    return item; // Mantém os outros itens inalterados
  });

  // 3. Verifica se a atualização ocorreu
  if (!wasUpdated) {
    return undefined; // Indica que a atualização falhou por não encontrar o item
  }

  // 4. Atualiza o cache em memória
  dataCache[entity] = updatedList;

  // 5. Persiste no disco (reescreve o arquivo JSON com a lista filtrada)
  writeData(entity, updatedList);

  return uptadeItem; // Retorna o item que foi atualizado com sucesso
}
// Inicializa os arquivos de dados na primeira execução
initializeDataFiles();

// Inicia os watchers para todas as entidades
startWatcher("deliverymen");
startWatcher("rental");
startWatcher("motorcycle");

// Exporta as funções necessárias
export default {
  readData,
  addItem,
};
