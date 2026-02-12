# README - Desafio Mottu Backend

[Português](#português) | [English](#english)

---

## Português

## Aplicação a ser desenvolvida

Seu objetivo é criar uma aplicação para gerenciar aluguel de motos e entregadores. Quando um entregador estiver registrado e com uma locação ativa poderá também efetuar entregas de pedidos disponíveis na plataforma.

Iremos executar um teste de integração para validar os cenários de uso. Por isso, sua aplicação deve seguir exatamente as especificações de API`s Rest do nosso Swager: request, response e status code.
Garanta que os atributos dos JSON`s e estão de acordo com o Swagger abaixo.

Swagger de referência:
https://app.swaggerhub.com/apis-docs/Mottu/mottu_desafio_backend/1.0.0

### Casos de uso

- Eu como usuário admin quero cadastrar uma nova moto.
  - Os dados obrigatórios da moto são Identificador, Ano, Modelo e Placa
  - A placa é um dado único e não pode se repetir.
    - Criar um consumidor para notificar quando o ano da moto for "2024"
    - Assim que a mensagem for recebida, deverá ser armazenada no banco de dados para consulta futura.
- Eu como usuário admin quero consultar as motos existentes na plataforma e conseguir filtrar pela placa.
- Eu como usuário admin quero modificar uma moto alterando apenas sua placa que foi cadastrado indevidamente
- Eu como usuário admin quero remover uma moto que foi cadastrado incorretamente, desde que não tenha registro de locações.
- Eu como usuário entregador quero me cadastrar na plataforma para alugar motos.
  - Os dados do entregador são( identificador, nome, cnpj, data de nascimento, número da CNHh, tipo da CNH, imagemCNH)
  - Os tipos de cnh válidos são A, B ou ambas A+B.
  - O cnpj é único e não pode se repetir.
  - O número da CNH é único e não pode se repetir.
- Eu como entregador quero enviar a foto de minha cnh para atualizar meu cadastro.
  - O formato do arquivo deve ser png ou bmp.
  - A foto não poderá ser armazenada no banco de dados, você pode utilizar um serviço de storage( disco local, amazon s3, minIO ou outros).
- Eu como entregador quero alugar uma moto por um período.
  - Os planos disponíveis para locação são:
    - 7 dias com um custo de R$30,00 por dia
    - 15 dias com um custo de R$28,00 por dia
    - 30 dias com um custo de R$22,00 por dia
    - 45 dias com um custo de R$20,00 por dia
    - 50 dias com um custo de R$18,00 por dia
  - A locação obrigatóriamente tem que ter uma data de inicio e uma data de término e outra data de previsão de término.
  - O inicio da locação obrigatóriamente é o primeiro dia após a data de criação.
  - Somente entregadores habilitados na categoria A podem efetuar uma locação.
- Eu como entregador quero informar a data que irei devolver a moto e consultar o valor total da locação.
  - Quando a data informada for inferior a data prevista do término, será cobrado o valor das diárias e uma multa adicional
    - Para plano de 7 dias o valor da multa é de 20% sobre o valor das diárias não efetivadas.
    - Para plano de 15 dias o valor da multa é de 40% sobre o valor das diárias não efetivadas.
  - Quando a data informada for superior a data prevista do término, será cobrado um valor adicional de R$50,00 por diária adicional.

---

## English

## Application to be developed

Your goal is to create an application to manage motorcycle rentals and delivery drivers. When a delivery driver is registered and has an active rental, they can also perform deliveries for orders available on the platform.

We will run an integration test to validate the use cases. Therefore, your application must strictly follow the REST API specifications of our Swagger: request, response, and status code. Ensure that the JSON attributes match the Swagger documentation below.

Reference Swagger:
https://app.swaggerhub.com/apis-docs/Mottu/mottu_desafio_backend/1.0.0

### Use Cases

- As an admin user, I want to register a new motorcycle.
  - Mandatory motorcycle data: Identifier, Year, Model, and License Plate.
  - The license plate is unique and cannot be repeated.
    - Create a consumer to notify when the motorcycle year is "2024".
    - Once the message is received, it should be stored in the database for future reference.
- As an admin user, I want to query existing motorcycles on the platform and filter by license plate.
- As an admin user, I want to modify a motorcycle, changing only its license plate if it was incorrectly registered.
- As an admin user, I want to remove a motorcycle that was incorrectly registered, provided there are no rental records.
- As a delivery driver, I want to register on the platform to rent motorcycles.
  - Delivery driver data: (identifier, name, CNPJ, date of birth, driver's license number, license type, license image).
  - Valid license types are A, B, or both A+B.
  - The CNPJ is unique and cannot be repeated.
  - The driver's license number is unique and cannot be repeated.
- As a delivery driver, I want to upload a photo of my license to update my registration.
  - The file format must be png or bmp.
  - The photo cannot be stored in the database; you may use a storage service (local disk, Amazon S3, MinIO, or others).
- As a delivery driver, I want to rent a motorcycle for a period.
  - Available rental plans:
    - 7 days at a cost of R$30.00 per day
    - 15 days at a cost of R$28.00 per day
    - 30 days at a cost of R$22.00 per day
    - 45 days at a cost of R$20.00 per day
    - 50 days at a cost of R$18.00 per day
  - The rental must have a start date, an end date, and an expected end date.
  - The rental start date must be the first day after the creation date.
  - Only drivers with a category A license can perform a rental.
- As a delivery driver, I want to inform the return date and check the total rental amount.
  - When the return date is before the expected end date, the daily rates plus an additional fine will be charged:
    - For the 7-day plan, the fine is 20% of the value of the remaining daily rates.
    - For the 15-day plan, the fine is 40% of the value of the remaining daily rates.
  - When the return date is after the expected end date, an additional amount of R$50.00 per extra day will be charged.
