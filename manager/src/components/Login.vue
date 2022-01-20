<template>
  <div id="app">
    <div class="logregcontainer">
      <img
        alt="Logo azienda"
        style="width: 130px"
        src=".././assets/N+.png"
        id="logreglogo"
      />
      <div class="ins">
        <input
          aria-label="inserisci l'username per accedere"
          type="text"
          id="username"
          v-model="username"
          placeholder="Username"
        />
      </div>
      <div class="ins">
        <input
          aria-label="inserisci la password per accedere"
          type="password"
          id="password"
          v-model="password"
          placeholder="Password"
        />
      </div>
      <p style="color: red">{{ error }}</p>
      <div class="buttons">
        <button
          @click="login"
          class="logreg"
          id="btnreg"
          aria-label="pulsante login"
        >
          Login
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      error: "",
    };
  },
  methods: {
    login() {
      let user = {
        username: this.username,
        password: this.password,
      };
      axios
        .post("/login_manager", user) // faccio la post su server a login e mando l'user
        .then(
          (res) => {
            if (res.status == 200) {
              localStorage.setItem("token_manager", res.data.token);
              this.$router.push("/manager");
            }
          },
          (err) => {
            this.error = err.response.data.error;
          }
        );
    },
    insert() {
      axios.post("/crea_manager");
    },
  },
};
</script>

<style>
#logreglogo {
  margin-bottom: 10px;
}

.logregutilities svg {
  margin-left: 5px;
  margin-top: 5px;
  cursor: pointer;
}

.logregutilities label {
  color: #007bac;
  font-size: 15px;
  cursor: pointer;
  margin-left: 5px;
}

.logregcontainer {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%);
  margin: auto;
  padding: 10px;
  width: 400px;
  margin-top: 3%;
  text-align: center;
  background-image: linear-gradient(to bottom right, #00a0e0 10%, #007bac);
}

.ins {
  padding: 5px;
}

.ins input {
  width: 300px;
  padding: 15px;
  border-radius: 6px;
  font-size: 15px;
  vertical-align: middle;
  margin: auto;
  border: 1px solid #025170;
  background-color: #025170;
  color: white;
}

.buttons {
  padding: 5px;
}

.logreg {
  background-color: white;
  text-align: center;
  width: 333px;
  border-radius: 6px;
  border: none;
  font-size: 15px;
  font-weight: bold;
  color: #007bac;
  padding: 15px;
  margin-bottom: 10px;
}

button:hover {
  background: rgb(229, 240, 245);
  cursor: pointer;
}

button:active {
  position: relative;
  top: 1px;
  left: 1px;
}

.descr {
  color: white;
  font-size: 12px;
  text-align: center;
}

#error {
  font-size: 12px;
  color: red;
}

.logreg_mid {
  background-color: white;
  text-align: center;
  width: 163px;
  margin: 3px;
  border-radius: 6px;
  border: none;
  font-size: 15px;
  font-weight: bold;
  color: #007bac;
  padding: 15px;
  margin-bottom: 10px;
}

.logreg:disabled {
  visibility: hidden;
}
</style>