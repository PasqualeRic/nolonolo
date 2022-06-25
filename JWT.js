const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
  const accessToken = sign(
    { username: user.username},
    "jwtsecretplschange"
  );

  return accessToken;
};

function leggiCookie(nomeCookie, ca)
{
  if (ca.length > 0)
  {
    var inizio = ca.indexOf(nomeCookie + "=");
    if (inizio != -1)
    {
      inizio = inizio + nomeCookie.length + 1;
      var fine = ca.indexOf(";",inizio);
      if (fine == -1) fine = ca.length;
      return unescape(ca.substring(inizio,fine));
    }else{
       return "";
    }
  }
  return "";
}

const validateToken = (req, res, next) => {
  const accessToken = leggiCookie('access-token', req.header('cookie'));

  if (!accessToken)
    return res.status(400).json({ error: "User not Authenticated!" });

  try {
    const validToken = verify(accessToken, "jwtsecretplschange");
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

module.exports = { createTokens, validateToken };
