# Nome do Projeto

Aplicação para gerenciamento de refeições, permitindo o registro, edição e acompanhamento de métricas relacionadas à dieta dos usuários.

## Funcionalidades

### Usuários
- Criar um usuário.
- Identificar o usuário entre as requisições.

### Refeições
- Registrar uma refeição com as seguintes informações:
  - Nome
  - Descrição
  - Data e Hora
  - Indicador de estar dentro ou fora da dieta
- Editar uma refeição (todos os campos podem ser alterados).
- Apagar uma refeição.
- Listar todas as refeições de um usuário.
- Visualizar detalhes de uma única refeição.

### Métricas
- Total de refeições registradas.
- Total de refeições dentro da dieta.
- Total de refeições fora da dieta.
- Melhor sequência de refeições dentro da dieta (maior número de refeições saudáveis consecutivas).

### Acesso
- Cada usuário só pode visualizar, editar ou apagar **suas próprias** refeições.

---

**Observação:** Todas as refeições estão vinculadas ao usuário que as criou, garantindo isolamento de dados.