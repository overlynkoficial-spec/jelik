
# Guia de Deploy Jelik Modas (Hostinger)

Este projeto foi preparado para uma instalação única na Hostinger, utilizando o build estático do Vite.

## Passos para o Deploy

1. **Gerar a Build localmente:**
   No seu computador, abra o terminal na pasta do projeto e execute:
   ```bash
   npm run build
   ```
   *Isso criará uma pasta chamada `dist` no seu projeto.*

2. **Preparar os Arquivos:**
   Entre na pasta `dist` que foi criada. Você verá arquivos como `index.html`, `assets/`, etc.

3. **Upload via Gerenciador de Arquivos (Hostinger):**
   - Acesse o painel da Hostinger -> Gerenciador de Arquivos.
   - Vá para a pasta `public_html`.
   - Faça o upload de **todo o conteúdo** que está dentro da pasta `dist` local para dentro da `public_html`.

4. **Configuração do Roteamento (Importante):**
   Como utilizamos o roteamento por "Hash" (`/#admin`), você não precisa de configurações extras de `.htaccess` para as rotas funcionarem. O site abrirá normalmente.

## Observações
- **Banco de Dados:** Por enquanto, as alterações feitas no painel são salvas no navegador (`localStorage`).
- **Imagens:** As imagens que você subiu via Painel Adm estão salvas no seu navegador. Para que elas fiquem salvas para todos os clientes, precisaremos conectar o Supabase Storage em breve.
