const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();

  // 1. Acessar a página de login
  await page.goto('https://senac.blackboard.com/', { waitUntil: 'networkidle2' });
  console.log('Página de login carregada');

  // 2. Preencher usuário - clicar, digitar e dar Tab para disparar eventos
  await page.waitForSelector('#user_id_tmp', { visible: true });
  await page.click('#user_id_tmp');
  await page.keyboard.type('10773755900', { delay: 50 });
  await page.keyboard.press('Tab');
  // Aguardar eventos processarem
  await new Promise(r => setTimeout(r, 1000));
  console.log('Usuário preenchido');

  // 3. Preencher senha
  await page.click('#password');
  await page.keyboard.type('10773755900', { delay: 50 });
  console.log('Senha preenchida');

  // 4. Clicar no botão de login
  await page.click('#entry-login');
  console.log('Botão de login clicado');

  // Aguardar navegação pós-login
  try {
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
    console.log('Login realizado com sucesso! URL:', page.url());
  } catch (e) {
    console.log('Página após clique. URL:', page.url());
  }

  // Screenshot como evidência
  await page.screenshot({ path: 'login-sucesso.png', fullPage: true });
  console.log('Screenshot salvo em login-sucesso.png');

  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();
