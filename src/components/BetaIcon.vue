<template>
  <a href="https://github.com/itamarom/notepadjs" target="_blank">
    <div class="beta-icon"
      data-tooltip="You are using the beta version. Please don't use this for anything important and report any bugs in the GitHub repository.">
      <img src="../assets/beta.svg" alt="Beta" />
    </div>
  </a>
</template>

<style>
.beta-icon {
  position: relative;
}

.beta-icon img {
  width: 32px;
  padding: 8px;
}

[data-tooltip]:hover::after {
  display: block;
  position: absolute;
  content: attr(data-tooltip);
  border: 1px solid black;
  background: #eee;
  padding: 4px;
  border-radius: 4px;
  width: 400px;
}
</style>
