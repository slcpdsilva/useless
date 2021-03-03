<script>
	import * as lib from './lib.js';

	import Cookies from 'js-cookie';

	import { sha256 } from 'js-sha256';

	import { location, push } from 'svelte-spa-router';

	if (Cookies.get('user')) {
		push('/');
	}

	let ERROR_LOCATION;
	let ERROR_MESSAGE;

	let name;
	let email;
	let password;

	function register() {
		if (name.length < 2 || name.length > 32) {
			ERROR_LOCATION = 'name';
			ERROR_MESSAGE = 'Your name must be between 2 and 32 characters in length.';
		} else if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))) {
			ERROR_LOCATION = 'email';
			ERROR_MESSAGE = 'This e-mail is not valid.';				
		} else if (password.length < 8) {
			ERROR_LOCATION = 'password';
			ERROR_MESSAGE = 'Your password must be at least 8 characters long.';
		} else {
			const email_query = lib.queryUsersWithEmail(email);
			if (email_query[0]) {
				ERROR_LOCATION = 'email';
				ERROR_MESSAGE = 'There is already an account registered with this email.';					
			} else {
				password = sha256(password);
				lib.insertUser({name: name, discriminator: name, email: email, password: password});

				Cookies.set('user', JSON.stringify(
					{
						name: name,
						discriminator: name,
						email: email
					}
				));

				push('/');
			}
		}
	}

	function login() {
		const email_query = lib.queryUsersWithEmail(email);
		if (email_query[0]) {
			password = sha256(password);
			const email_with_password_query = lib.queryUsersWithEmailAndPassword(email, password);
			if (email_with_password_query[0]) {
				Cookies.set('user', JSON.stringify(
					{
						name: email_with_password_query[0].name,
						discriminator: email_with_password_query[0].discriminator,
						email: email_with_password_query[0].email
					}
				));

				push('/');
			} else {
				ERROR_LOCATION = 'password';
				ERROR_MESSAGE = 'This password doesn\'t match your email.';	
			}
		} else {
			ERROR_LOCATION = 'email';
			ERROR_MESSAGE = 'There are no accounts registered with this e-mail.';	
		}
	}
</script>

<div style="display: flex; flex-direction: column; width: 100%; height: 100%;">
	<span on:click={() => push('/')} id="logo" style="margin: 60px auto 10px; font-size: 24px; font-weight: 900; color: var(--tertiary-secondary-color);">Bambino</span>
	{#if $location == '/register'}
		<div style="margin: 0 auto; padding: 50px 60px; width: 100%; max-width: 400px;">
			<div style="display: flex; justify-content: center;">
				<span class="link" style="font-weight: 700; color: var(--theme-color)">Register</span>
				<span class="link" on:click={() => push('/login')} style="margin-left: 15px; color: var(--theme-color)">Login</span>
			</div>
			<div style="display: flex; flex-direction: column; margin-top: 30px;">
				<span style="font-size: 22px; font-weight: 700;">Create an Account</span>
				<span style="margin-top: 5px; font-size: 16px;">With an account, you can build a profile and save settings for better personalization.</span>
			</div>
			<div style="margin-top: 30px;">
				<div style="display: flex; flex-direction: column;">
					<div style="display: flex;">
						<span style="font-size: 12px; font-weight: 700; color: var(--tertiary-secondary-color);">NAME</span>
						{#if ERROR_LOCATION == 'name'}
							<span style="font-size: 12px; font-weight: 700; color: #f53d59;"><span style="margin: 0 5px;">—</span> {ERROR_MESSAGE}</span>
						{/if}
					</div>
					<input bind:value={name} style="margin-top: 10px; padding: 12px 18px; background-color: var(--primary-secondary-color); border: 1px solid var(--secondary-primary-color); border-radius: 4px; outline: none;" maxlength="32">
				</div>
				<div style="display: flex; flex-direction: column; margin-top: 15px;">
					<div style="display: flex;">
						<span style="font-size: 12px; font-weight: 700; color: var(--tertiary-secondary-color);">E-MAIL</span>
						{#if ERROR_LOCATION == 'email'}
							<span style="font-size: 12px; font-weight: 700; color: #f53d59;"><span style="margin: 0 5px;">—</span> {ERROR_MESSAGE}</span>
						{/if}
					</div>
					<input bind:value={email} style="margin-top: 10px; padding: 12px 18px; background-color: var(--primary-secondary-color); border: 1px solid var(--secondary-primary-color); border-radius: 4px; outline: none;">
				</div>
				<div style="display: flex; flex-direction: column; margin-top: 15px;">
					<div style="display: flex;">
						<span style="font-size: 12px; font-weight: 700; color: var(--tertiary-secondary-color);">PASSWORD</span>
						{#if ERROR_LOCATION == 'password'}
							<span style="font-size: 12px; font-weight: 700; color: #f53d59;"><span style="margin: 0 5px;">—</span> {ERROR_MESSAGE}</span>
						{/if}
					</div>
					<input bind:value={password} style="margin-top: 10px; padding: 12px 18px; background-color: var(--primary-secondary-color); border: 1px solid var(--secondary-primary-color); border-radius: 4px; outline: none;" type="password">
				</div>
			</div>
			<button on:click={register} class="register-login-button" style="margin-top: 30px; padding: 12px 18px; width: 100%; background-color: var(--theme-color); border: 0; border-radius: 2px; font-weight: 700; color: var(--primary-primary-color);">Register</button>
		</div>
	{:else if $location == '/login'}
		<div style="margin: 0 auto; padding: 50px 60px; width: 100%; max-width: 400px;">
			<div style="display: flex; justify-content: center;">
				<span class="link" on:click={() => push('/register')} style="color: var(--theme-color)">Register</span>
				<span class="link" style="margin-left: 15px; font-weight: 700; color: var(--theme-color)">Login</span>
			</div>
			<div style="display: flex; flex-direction: column;">
				<span style="font-size: 22px; font-weight: 700;">Enter</span>
			</div>
			<div style="margin-top: 30px;">
				<div style="display: flex; flex-direction: column;">
					<div style="display: flex;">
						<span style="font-size: 12px; font-weight: 700; color: var(--tertiary-secondary-color);">E-MAIL</span>
						{#if ERROR_LOCATION == 'email'}
							<span style="font-size: 12px; font-weight: 700; color: #f53d59;"><span style="margin: 0 5px;">—</span> {ERROR_MESSAGE}</span>
						{/if}
					</div>
					<input bind:value={email} style="margin-top: 10px; padding: 12px 18px; background-color: var(--primary-secondary-color); border: 1px solid var(--secondary-primary-color); border-radius: 4px; outline: none;">
				</div>
				<div style="display: flex; flex-direction: column; margin-top: 15px;">
					<div style="display: flex;">
						<span style="font-size: 12px; font-weight: 700; color: var(--tertiary-secondary-color);">PASSWORD</span>
						{#if ERROR_LOCATION == 'password'}
							<span style="font-size: 12px; font-weight: 700; color: #f53d59;"><span style="margin: 0 5px;">—</span> {ERROR_MESSAGE}</span>
						{/if}
					</div>
					<input bind:value={password} style="margin-top: 10px; padding: 12px 18px; background-color: var(--primary-secondary-color); border: 1px solid var(--secondary-primary-color); border-radius: 4px; outline: none;" type="password">
				</div>
			</div>
			<button on:click={login} class="register-login-button" style="margin-top: 30px; padding: 12px 18px; width: 100%; background-color: var(--theme-color); border: 0; border-radius: 2px; font-weight: 700; color: var(--primary-primary-color);">Login</button>
		</div>
	{/if}
</div>

<style>
	#logo:hover {
		cursor: pointer;
	}
	.link:hover {
		cursor: pointer;
		color: var(--theme-color-strong) !important;
	}
	.register-login-button:hover {
		cursor: pointer;
		background-color: var(--theme-color-strong) !important;
	}
</style>