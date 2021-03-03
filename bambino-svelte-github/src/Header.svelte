<script>
	import { push } from 'svelte-spa-router';

	export let user;
	export let openUserSettingsModal;
	export let openNewPostModal;
	let USER_TOOLTIP_IS_OPEN = false;
	export 	function closeUserTooltip() {
		USER_TOOLTIP_IS_OPEN = false;
	}
	function openUserTooltip() {
		USER_TOOLTIP_IS_OPEN = true;
	}
</script>

<div on:click={closeUserTooltip} style="border-bottom: 1px solid var(--secondary-primary-color);">
	<div style="display: flex; justify-content: space-between; align-items: center; margin: 0 auto; max-width: 1000px; padding: 40px 60px;">	
		<div style="width: 33.33%;">			
			<span id="logo" on:click={() => push('/')} style="font-size: 24px; font-weight: 900; color: var(--tertiary-secondary-color);">Bambino</span>
		</div>
		<div style="display: flex; justify-content: flex-end; width: 33.33%;">
			{#if (!(user === false))}
				<div style="position: relative;">
					<div on:click|stopPropagation={openUserTooltip} id="open-user-tooltip" style="display: flex; align-items: center;">
						<img style="width: 30px; height: 30px; border-radius: 100%; background-color: var(--theme-color);">
						<svg style="margin-left: 5px; width: 16px; height: 16px; color: var(--tertiary-secondary-color);" xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M112 184l144 144 144-144'/></svg>
					</div>
					{#if USER_TOOLTIP_IS_OPEN}
						<div on:click|stopPropagation style="position: absolute; top: calc(100% + 5px); right: 0; width: 200px; background-color: var(--primary-primary-color); border: 1px solid var(--secondary-primary-color); border-radius: 4px; box-shadow: 2px 2px 4px var(--secondary-primary-color);">
							<div style="padding: 12px 18px; background-color: var(--primary-secondary-color); border-bottom: 1px solid var(--secondary-primary-color);">
								<span>{user.name}</span>
								<span style="color: var(--tertiary-secondary-color);">(@{user.discriminator})</span>
							</div>
							<div on:click={openUserSettingsModal} class="user-tooltip-link" style="display: flex; align-items: center; padding: 12px 18px;">
								<span style="font-weight: 700;">User Settings</span>
								<svg style="margin-left: auto; width: 16px; height: 16px;" xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Settings</title><path d='M262.29 192.31a64 64 0 1057.4 57.4 64.13 64.13 0 00-57.4-57.4zM416.39 256a154.34 154.34 0 01-1.53 20.79l45.21 35.46a10.81 10.81 0 012.45 13.75l-42.77 74a10.81 10.81 0 01-13.14 4.59l-44.9-18.08a16.11 16.11 0 00-15.17 1.75A164.48 164.48 0 01325 400.8a15.94 15.94 0 00-8.82 12.14l-6.73 47.89a11.08 11.08 0 01-10.68 9.17h-85.54a11.11 11.11 0 01-10.69-8.87l-6.72-47.82a16.07 16.07 0 00-9-12.22 155.3 155.3 0 01-21.46-12.57 16 16 0 00-15.11-1.71l-44.89 18.07a10.81 10.81 0 01-13.14-4.58l-42.77-74a10.8 10.8 0 012.45-13.75l38.21-30a16.05 16.05 0 006-14.08c-.36-4.17-.58-8.33-.58-12.5s.21-8.27.58-12.35a16 16 0 00-6.07-13.94l-38.19-30A10.81 10.81 0 0149.48 186l42.77-74a10.81 10.81 0 0113.14-4.59l44.9 18.08a16.11 16.11 0 0015.17-1.75A164.48 164.48 0 01187 111.2a15.94 15.94 0 008.82-12.14l6.73-47.89A11.08 11.08 0 01213.23 42h85.54a11.11 11.11 0 0110.69 8.87l6.72 47.82a16.07 16.07 0 009 12.22 155.3 155.3 0 0121.46 12.57 16 16 0 0015.11 1.71l44.89-18.07a10.81 10.81 0 0113.14 4.58l42.77 74a10.8 10.8 0 01-2.45 13.75l-38.21 30a16.05 16.05 0 00-6.05 14.08c.33 4.14.55 8.3.55 12.47z' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/></svg>
							</div>
						</div>
					{/if}
				</div>
				<button on:click={openNewPostModal} style="margin-left: 30px; width: 80px; padding: 5px 0; background-color: var(--theme-color); border: 0; border-radius: 4px; font-weight: 700; color: var(--primary-primary-color);" id="new-post-button">New Post</button>
			{:else}
				<button on:click={() => push('/login')} style="width: 80px; padding: 5px 0; background-color: var(--primary-primary-color); border: 1px solid var(--tertiary-secondary-color); border-radius: 4px; font-weight: 700; color: var(--tertiary-secondary-color);" id="login-button">Login</button>	
				<button on:click={() => push('/register')} style="margin-left: 10px; width: 80px; padding: 5px 0; background-color: var(--tertiary-secondary-color); border: 0; border-radius: 4px; font-weight: 700; color: var(--primary-primary-color);" id="register-button">Register</button>
			{/if}	
		</div>
	</div>
</div>

<style>
	#logo:hover {
		cursor: pointer;
	}
	#login-button:hover {
		cursor: pointer;
		border: 1px solid var(--tertiary-tertiary-color) !important;
		color: var(--tertiary-tertiary-color) !important;
	}
	#register-button:hover {
		cursor: pointer;
		background-color: var(--tertiary-tertiary-color) !important;
		border: 1px solid var(--tertiary-tertiary-color) !important;
	}
	#open-user-tooltip:hover {
		cursor: pointer;
	}
	.user-tooltip-link:hover {
		cursor: pointer;
		background-color: var(--primary-tertiary-color) !important;
	}
	.user-tooltip-link:hover > * {
		color: var(--tertiary-secondary-color) !important;
	}
	#new-post-button:hover {
		cursor: pointer;
		background-color: var(--theme-color-strong) !important;
	}
</style>