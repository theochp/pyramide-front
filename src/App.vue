<template>
  <div id="app">
    <h1><a href="/">Pyramid</a></h1>
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
  }
</script>

<style lang="scss">
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  ul {
    padding: 0;

    &.inline {

      li {
        display: inline-block;
      }

    }
  }

  li {
    list-style: none;
  }

  #app {
    width: 100%;
    height: 100%;
    overflow: auto;

    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
