<template>
  <footer class="footer-copyright text-center py-3" id="footer">
    <div class="infobox">
      <div class="left">
        <span>link utili</span>
        <ul>
          <li>
            <a href="/">Cliente</a>
          </li>
          <li>
            <a href="/boff/b_off.html">Funzionario</a>
          </li>
        </ul>
      </div>
      <div class="right">
        <img
          alt="logo azienda"
          id="logreglogo"
          style="width: 50px"
          src=".././assets/N+.png"
        />
        <span>NoloNolo+</span>
      </div>
    </div>
    <div class="closing">
      <span>Copyright © Tecnologie Web: NoloNolo+ 2021</span>
    </div>
  </footer>
</template>
<style>
#footer {
  background-color: #007bac;
  color: white;
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
}

.infobox {
  display: grid;
  grid-template-areas: "left right";
  grid-template-columns: 50% 50%;
}

.left,
.right,
.closing {
  text-align: center;
  text-transform: uppercase;
  font-size: 10px;
}

.left {
  grid-area: left;
}

.left span {
  font-size: 15px;
  font-weight: bold;
}

.left ul,
.left ul a,
.left ul a:hover {
  list-style: none;
  margin: 0;
  margin-bottom: 0px;
  padding: 0;
  color: lightgrey;
  text-decoration: none;
}

.left li {
  color: lightgrey;
}

.right {
  grid-area: right;
  text-align: center;
}
</style>