<template>
  <nav class="bg-white shadow-md border-b-[7px] border-[#FFA800] h-[60px] md:h-[122px] z-50">
    <div class="container-fluid md:px-3">
      <div class="px-3 flex items-center justify-between h-[60px] md:h-[117px]">
        <!-- Logo -->
        <a href="https://curaduria2barranquilla.com" class="shrink-0 py-2 hidden lg:block">
          <img 
            src="http://www.curaduria2barranquilla.com/nuevapagina/img/Logo2.png" 
            alt="logo" 
            class="h-[155px] w-auto"
          >
        </a>

        <!-- Botón hamburguesa para móvil -->
        <button 
          @click="isMenuOpen = !isMenuOpen"
          class="lg:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
          aria-label="Toggle navigation"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              v-if="!isMenuOpen"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path 
              v-else
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Menú desktop -->
        <div class="flex items-center justify-evenly w-full">
          <ul class="hidden w-full justify-around lg:flex lg:items-center lg:space-x-1">
            <li class="text-center min-w-[110px]">
              <a href="https://curaduria2barranquilla.com" class="nav-item-link">Inicio</a>
            </li>
            <li class="text-center min-w-[110px]">
              <a href="https://curaduria2barranquilla.com/pages/curaduria.html" class="nav-item-link">Curaduría</a>
            </li>
            <li id="menu_licencia">
              <a href="https://curaduria2barranquilla.com/pages/licencia_y_requisitos.html" class="nav-item-link">Licencias y Requisitos</a>
            </li>
            <li>
              <a href="https://curaduria2barranquilla.com/pages/transparencia.html" class="nav-item-link">Transparencia</a>
            </li>
            <li>
              <a href="https://curaduria2barranquilla.com/pages/descargas.html" class="nav-item-link">Descargas</a>
            </li>
            <li class="text-center min-w-[115px]">
              <a href="https://curaduria2barranquilla.com/pages/contactos.html" class="nav-item-link">Contactos</a>
            </li>
            <li class="text-center min-w-[115px]">
              <a href="https://curaduria2barranquilla.com/pages/publicaciones.html" class="nav-item-link">Publicaciones</a>
            </li>
            <li class="text-center min-w-[100px]">
              <router-link to="/" class="nav-item-link">Ventanilla</router-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- Menú móvil -->
      <div 
        :class="isMenuOpen ? 'block' : 'hidden'"
        class="lg:hidden pb-4 bg-gray-100"
      >
        <ul class="space-y-2 ">
          <li>
            <router-link to="/" class="nav-item-link-mobile">Inicio</router-link>
          </li>
          <li>
            <a href="https://curaduria2barranquilla.com/curaduria.html" target="_blank" class="nav-item-link-mobile">Curaduría</a>
          </li>
          <li>
            <a href="https://curaduria2barranquilla.com/licencia_y_requisitos.html" target="_blank" class="nav-item-link-mobile">Licencias y Requisitos</a>
          </li>
          <li>
            <a href="https://curaduria2barranquilla.com/transparencia.html" target="_blank" class="nav-item-link-mobile">Transparencia</a>
          </li>
          <li>
            <a href="https://curaduria2barranquilla.com/descargas.html" target="_blank" class="nav-item-link-mobile">Descargas</a>
          </li>
          <li>
            <a href="https://curaduria2barranquilla.com/contactos.html" target="_blank" class="nav-item-link-mobile">Contactos</a>
          </li>
          <li>
            <a href="https://curaduria2barranquilla.com/publicaciones.html" target="_blank" class="nav-item-link-mobile">Publicaciones</a>
          </li>
          <li>
            <router-link to="/" class="nav-item-link-mobile">Ventanilla</router-link>
          </li>
          <li>
            <router-link to="/login" class="nav-item-link-mobile">Intranet</router-link>
          </li>
          <li class="pt-2 flex justify-center">
            <a 
              href="https://curaduria2barranquilla.com/consultas.html" 
              target="_blank"
              class="btn-consultas w-[80%] text-center"
            >
              Consultas
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)
</script>

<style scoped>
.nav-item-link {
  display: block;
  padding: 0.5rem 0.75rem;
  font-family: 'Poppins';
  color: #1A4972;
  font-weight: 600;
  font-size: 1rem;
  transition: color 0.2s;
  text-decoration: none;
}

.nav-item-link:hover {
  color: #0d2d47;
}

.nav-item-link-mobile {
  display: block;
  padding: 0.5rem 1rem;
  font-family: 'Poppins';
  color: #1A4972;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.2s, color 0.2s;
  border-radius: 0.25rem;
  text-decoration: none;
}

.nav-item-link-mobile:hover {
  background-color: #f3f4f6;
}

.btn-consultas {
  font-weight: 600;
  font-size: 1rem;
  background-color: #FFA800 !important;
  color: #FFFFFF !important;
  border-radius: 30px;
  padding: 6px 48px;
  box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15) !important;
}

.btn-consultas:hover {
  background-color: #FFA800 !important;
  color: #FFFFFF !important;
}
</style>
