// server.js - FESMP Landing Page
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de segurança e performance
app.use(helmet({
  contentSecurityPolicy: false, // Desabilitado para permitir Google Maps e outros recursos externos
}));
app.use(compression());

// Configurar view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parse de JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Função para carregar dados JSON com tratamento de erro
function loadJSON(filename) {
  try {
    return require(path.join(__dirname, 'data', filename));
  } catch (error) {
    console.warn(`⚠️  Arquivo ${filename} não encontrado, usando array vazio`);
    return [];
  }
}

// Importar dados
const noticias = loadJSON('noticias.json');
const professores = loadJSON('professores.json');
const depoimentos = loadJSON('depoimentos.json');
const parceiros = loadJSON('parceiros.json');
const cursos = loadJSON('cursos.json');

// Rota principal
app.get('/', (req, res) => {
  try {
    res.render('index', {
      pageTitle: 'FESMP - Fundação Escola Superior do Ministério Público de Mato Grosso',
      metaDescription: 'Instituição de ensino superior credenciada pelo MEC, oferecendo cursos de pós-graduação com qualidade e tradição em Mato Grosso.',
      noticias: noticias.slice(0, 6), // Últimas 6 notícias
      professores: professores.slice(0, 9), // Primeiros 9 professores
      depoimentos: depoimentos,
      parceiros: parceiros,
      cursos: cursos
    });
  } catch (error) {
    console.error('Erro ao renderizar página:', error);
    res.status(500).send(`
      <html>
        <head>
          <title>Erro - FESMP</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 50px; text-align: center; }
            h1 { color: #C1272D; }
          </style>
        </head>
        <body>
          <h1>Erro ao carregar a página</h1>
          <p>Ocorreu um erro ao processar sua solicitação.</p>
          <p><strong>Detalhes:</strong> ${error.message}</p>
          <a href="/">Voltar para Home</a>
        </body>
      </html>
    `);
  }
});

// Rota de notícias (página completa)
app.get('/noticias', (req, res) => {
  try {
    res.render('noticias', {
      pageTitle: 'Notícias - FESMP',
      metaDescription: 'Acompanhe as últimas notícias da FESMP',
      noticias: noticias
    });
  } catch (error) {
    res.redirect('/');
  }
});

// Rota de contato
app.get('/contato', (req, res) => {
  try {
    res.render('contato', {
      pageTitle: 'Contato - FESMP',
      metaDescription: 'Entre em contato com a FESMP'
    });
  } catch (error) {
    res.redirect('/');
  }
});

// Rota para matrícula (redireciona para sistema externo)
app.get('/matricula', (req, res) => {
  res.redirect('https://fundacaoescola.escolaweb.com.br/matriculaonline/#/home');
});

// Rota para portal do aluno (redireciona para sistema externo)
app.get('/portal-aluno', (req, res) => {
  res.redirect('https://fundacaoescola.escolaweb.com.br/login.html#!/');
});

// API endpoint para envio de formulário de contato
app.post('/api/contato', (req, res) => {
  // Aqui você pode implementar o envio de email ou salvar no banco de dados
  console.log('📧 Formulário de contato recebido:', req.body);
  
  // Por enquanto, apenas retorna sucesso
  res.json({
    success: true,
    message: 'Mensagem recebida com sucesso! Entraremos em contato em breve.'
  });
});

// Página 404 - Não encontrada
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Página não encontrada - FESMP</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #1A1A1A 0%, #2a2a2a 100%);
          color: white;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
        }
        .container {
          max-width: 600px;
        }
        h1 {
          font-size: 8rem;
          color: #C1272D;
          margin-bottom: 1rem;
          text-shadow: 0 0 20px rgba(193, 39, 45, 0.5);
        }
        h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        p {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 2rem;
        }
        a {
          display: inline-block;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #C1272D 0%, #A01F24 100%);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          transition: transform 0.3s ease;
        }
        a:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(193, 39, 45, 0.4);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>404</h1>
        <h2>Página não encontrada</h2>
        <p>Desculpe, a página que você está procurando não existe.</p>
        <a href="/">Voltar para Home</a>
      </div>
    </body>
    </html>
  `);
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err.stack);
  res.status(500).send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Erro - FESMP</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #1A1A1A 0%, #2a2a2a 100%);
          color: white;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
        }
        .container {
          max-width: 600px;
        }
        h1 {
          font-size: 4rem;
          color: #C1272D;
          margin-bottom: 1rem;
        }
        p {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 2rem;
        }
        a {
          display: inline-block;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #C1272D 0%, #A01F24 100%);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          transition: transform 0.3s ease;
        }
        a:hover {
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Oops!</h1>
        <p>Algo deu errado. Por favor, tente novamente mais tarde.</p>
        <a href="/">Voltar para Home</a>
      </div>
    </body>
    </html>
  `);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║        🎓 FESMP - Landing Page Iniciada 🎓           ║
║                                                       ║
║  Servidor rodando em: http://localhost:${PORT}         ║
║  Ambiente: ${process.env.NODE_ENV || 'development'}                      ║
║                                                       ║
║  📂 Dados carregados:                                ║
║     • ${noticias.length} notícias                                  ║
║     • ${professores.length} professores                               ║
║     • ${depoimentos.length} depoimentos                               ║
║     • ${parceiros.length} parceiros                                 ║
║     • ${cursos.length} cursos                                     ║
║                                                       ║
║  Pressione Ctrl+C para parar                         ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

module.exports = app;