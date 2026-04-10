import puppeteer, { Browser, Page } from 'puppeteer';
import path from 'path';

const URL_LOGIN = 'https://senac.blackboard.com/';
const USUARIO = '10773755900';
const SENHA = '10773755900';

async function abrirNavegador(): Promise<{ browser: Browser; page: Page }> {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();
  return { browser, page };
}

async function acessarPaginaLogin(page: Page): Promise<void> {
  await page.goto(URL_LOGIN, { waitUntil: 'networkidle2' });
  console.log('Página de login carregada');
}

async function preencherUsuario(page: Page): Promise<void> {
  await page.waitForSelector('#user_id_tmp', { visible: true });
  await page.click('#user_id_tmp');
  await page.keyboard.type(USUARIO, { delay: 50 });
  await page.keyboard.press('Tab');
  await new Promise(r => setTimeout(r, 1000));
  console.log('Usuário preenchido');
}

async function preencherSenha(page: Page): Promise<void> {
  await page.click('#password');
  await page.keyboard.type(SENHA, { delay: 50 });
  console.log('Senha preenchida');
}

async function clicarBotaoLogin(page: Page): Promise<void> {
  await page.click('#entry-login');
  console.log('Botão de login clicado');
}

async function aguardarNavegacao(page: Page): Promise<void> {
  try {
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
    console.log('Login realizado com sucesso! URL:', page.url());
  } catch {
    console.log('Página após clique. URL:', page.url());
  }
}

async function salvarEvidencia(page: Page): Promise<string> {
  const caminho = path.resolve('login-sucesso.png');
  await page.screenshot({ path: caminho, fullPage: true });
  console.log('Screenshot salvo em', caminho);
  return caminho;
}

async function main(): Promise<void> {
  const { browser, page } = await abrirNavegador();

  await acessarPaginaLogin(page);
  await preencherUsuario(page);
  await preencherSenha(page);
  await clicarBotaoLogin(page);
  await aguardarNavegacao(page);
  await salvarEvidencia(page);

  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
}

main();
