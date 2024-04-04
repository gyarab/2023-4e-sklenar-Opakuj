<script setup lang="ts">
import {GoogleLogin, type CallbackTypes} from 'vue3-google-login';
const idconfiguration = {
    login_uri: "https://rocnikova-prace-4e.onrender.com/auth/callback/google-one-tap",
    ux_mode: "redirect",
    //redirect_uri: "https://rocnikova-prace-4e.onrender.com/auth/callback/google-one-tap",
}
</script>

<template>
  <!-- Google knihovna pro GOOGLE SIGN IN -->
<!-- <div class="container">
    <div>
        <div id="g_id_onload" data-client_id="17096130375-cb5v6mqhg3llh1r7ul1f67rn3j7gpmaj.apps.googleusercontent.com"
            data-ux_mode="popup" data-itp_support="true"
            data-login_uri="http://localhost:10000/callback/UwUgoogle-one-tap">
        </div>
        <div class="g_id_signin" data-type="standard" data-shape="rectangular" data-theme="outline"
            data-text="signin" data-size="large" data-locale="cs" data-logo_alignment="left" data-width="187">
        </div>
    </div>
</div> -->
<div class="container">
<GoogleLogin :id-configuration="idconfiguration">

</GoogleLogin>



</div>

</template>
<!-- <script src="https://accounts.google.com/gsi/client" async defer></scrip> -->
