<template>
  <div class="login-header">
    <h2>Lumen</h2>
  </div>
  <!-- login/register container -->
  <div class="container" :class="state.containerClsList">
    <!-- register -->
    <div class="form-container sign-up-container">
      <div class="form">
        <h2>sign up</h2>
        <input
            type="text"
            name="username"
            id="username"
            placeholder="Username..."
        />
        <input type="email" name="emal" id="email" placeholder="Email..." />
        <input
            type="password"
            name="password"
            id="password"
            placeholder="Password..."
        />
        <button class="signUp">sign up</button>
      </div>
    </div>
    <!-- login -->
    <div class="form-container sign-in-container">
      <div class="form">
        <h2>sign in</h2>
        <input type="email" name="emal" id="email" placeholder="Email..." />
        <input
            type="password"
            name="password"
            id="password"
            placeholder="Password..."
        />
        <a href="#" class="forget-password">forget your password</a>
        <button class="signIn">sign in</button>
      </div>
    </div>
    <!-- overlay container -->
    <div class="overlay_container">
      <div class="overlay">
        <!-- overlay left -->
        <div class="overlay_panel overlay_left_container">
          <h2>welcome back!</h2>
          <p>To keep connected with us please login with your personal info</p>
          <button id="sign-in" @click="removeClass()">sign in</button>
        </div>
        <!-- overlay right -->
        <div class="overlay_panel overlay_right_container">
          <h2>hello friend!</h2>
          <p>Enter your personal details and start journey with us</p>
          <button id="sign-up" @click="addClass()">sign up</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, defineComponent, reactive, ref} from "vue";

export default defineComponent({
  name: "login",
  setup() {

    const state = reactive({
      model: {
        username: "",
        password: "",
      },
      loading: false,
      btnText: computed(() => (state.loading ? "登录中..." : "登录")),
      loginForm: ref(null),
      containerClsList: [],
    });

    const addClass = () => {
      state.containerClsList.push("active");
    };

    const removeClass = () => {
      state.containerClsList.splice(state.containerClsList.indexOf("active"),1);
    };

    return {
      state,
      addClass,
      removeClass,
    };
  },
});
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f6f5f7;
}

h2 {
  margin-bottom: 10px;
  font-size: 32px;
  text-transform: capitalize;
}
.login-header {
  position: absolute;
  top: 20%;
  left: 47.25%;
}

.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 768px;
  height: 480px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
}

.form-container {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  background-color: white;
  transition: all 0.6s ease-in-out;
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 0 50px;
}

input {
  width: 100%;
  margin: 8px 0;
  padding: 12px;
  background-color: #eee;
  border: none;
}

.forget-password {
  display: inline-block;
  height: 20px;
  text-decoration: none;
  color: #bbb;
  text-transform: capitalize;
  font-size: 12px;
}

.forget-password:hover {
  color: lightslategray;
  border-bottom: 2px solid #ff4b2b;
}

button {
  background: #ff4b2b;
  padding: 10px 50px;
  border: 1px solid transparent;
  border-radius: 20px;
  text-transform: uppercase;
  color: white;
  margin-top: 10px;
  outline: none;
  transition: transform 80;
}

button:active {
  transform: scale(0.95);
}

.overlay_container {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  z-index: 100;
  right: 0;
  overflow: hidden;
  transition: all 0.6s ease-in-out;
}

.overlay {
  position: absolute;
  width: 200%;
  height: 100%;
  left: -100%;
  background-color: #ff4b2b;
}

.overlay_panel {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  color: white;
  padding: 0 40px;
  text-align: center;
}

.overlay_panel button {
  background-color: transparent;
  border: 1px solid white;
}

.overlay_panel p {
  font-size: 12px;
  margin: 10px 0 15px 0;
}

.overlay_right_container {
  right: 0;
}

.container.active .sign-up-container {
  transform: translateX(100%);
  z-index: 5;
}

.container.active .sign-in-container {
  transform: translateX(100%);
}

.container.active .overlay_container {
  transform: translateX(-100%);
}

.container.active .overlay {
  transform: translateX(50%);
}
</style>
