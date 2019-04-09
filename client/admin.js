window.addEventListener('load', function() {
    var idToken;
    var accessToken;
    var expiresAt;
  
    var webAuth = new auth0.WebAuth({
      domain: 'vvvm23.eu.auth0.com',
      clientID: '4YXBtN7e1DYAhWi4NjVUkB2v01423QoT',
      responseType: 'token id_token',
      scope: 'openid',
      redirectUri: window.location.href
    });
  
    var loginBtn = document.getElementById('btn-login');
  
    loginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      webAuth.authorize();
    });
  
  });