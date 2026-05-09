<script lang="ts">
  import { dev } from '$app/environment';
  import { PUBLIC_CLARITY_PROJECT_ID } from '$env/static/public';

  const shouldLoadClarity = !dev && Boolean(PUBLIC_CLARITY_PROJECT_ID);
</script>

<svelte:head>
  {#if shouldLoadClarity}
    <script>
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${PUBLIC_CLARITY_PROJECT_ID}");
      `}
    </script>
  {/if}
</svelte:head>
