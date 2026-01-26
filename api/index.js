// api/index.js - FESMP Landing Page (Vercel)

const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();

// Diretório raiz do projeto (necessário para Vercel)
const rootDir = process.cwd();
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(compression());
// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(rootDir, 'views'));

// Arquivos estáticos
app.use(express.static(path.join(rootDir, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function loadJSON(filename) {
  try {
    return require(path.join(rootDir, 'data', filename));
  } catch (error) {
    console.warn(`Arquivo ${filename} não encontrado, usando array vazio`);
    return [];
  }
}

const noticias = loadJSON('noticias.json');
const professores = loadJSON('professores.json');
const depoimentos = loadJSON('depoimentos.json');
const parceiros = loadJSON('parceiros.json');
const cursos = loadJSON('cursos.json');

app.get('/', (req, res) => {
  try {
    res.render('index', {
      pageTitle: 'FESMP - Fundação Escola Superior do Ministério Público de Mato Grosso',
      metaDescription: 'Pós-graduações em Direito com compromisso acadêmico, excelência no ensino e formação qualificada para o desenvolvimento profissional jurídico.',
      noticias: noticias.slice(0, 6),
      professores: professores.slice(0, 9),
      depoimentos,
      parceiros,
      cursos
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao carregar a página.');
  }
});

app.get('/noticias', (req, res) => {
  try {
    res.render('noticias', {
      pageTitle: 'Notícias - FESMP',
      metaDescription: 'Acompanhe as últimas notícias da FESMP',
      noticias
    });
  } catch {
    res.redirect('/');
  }
});

app.get('/contato', (req, res) => {
  try {
    res.render('contato', {
      pageTitle: 'Contato - FESMP',
      metaDescription: 'Entre em contato com a FESMP'
    });
  } catch {
    res.redirect('/');
  }
});

app.get('/certificado', (req, res) => {
  try {
    res.render('certificado', {
      pageTitle: 'Certificado - FESMP',
      metaDescription: 'Informações sobre certificados da FESMP'
    });
  } catch {
    res.redirect('/');
  }
});

app.get('/mvv', (req, res) => {
  try {
    res.render('mvv', {
      pageTitle: 'Missão, Visão e Valores - FESMP',
      metaDescription: 'Conheça a missão, visão e valores da FESMP'
    });
  } catch {
    res.redirect('/');
  }
});

app.get('/matricula', (req, res) => {
  res.redirect('https://fundacaoescola.escolaweb.com.br/matriculaonline/#/home');
});

app.get('/portal-aluno', (req, res) => {
  res.redirect('https://fundacaoescola.escolaweb.com.br/login.html#!/');
});

app.post('/api/contato', (req, res) => {
  console.log('Formulário recebido:', req.body);

  res.json({
    success: true,
    message: 'Mensagem recebida com sucesso! Entraremos em contato em breve.'
  });
});

app.use((req, res) => {
  res.status(404).render('404', {
    pageTitle: 'Página não encontrada - FESMP'
  });
});

app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(500).send('Erro interno do servidor.');
});

module.exports = app;