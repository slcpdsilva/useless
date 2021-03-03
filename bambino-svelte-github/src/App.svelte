<script>
	import Router from 'svelte-spa-router';

	import SubApp from './SubApp.svelte';
	import Auth from './Auth.svelte';

	const routes = {
		'/login': Auth,
		'/register': Auth,
		'/': SubApp
	}
</script>

<Router {routes}/>