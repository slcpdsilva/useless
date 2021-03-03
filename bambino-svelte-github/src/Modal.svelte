<script>
	import Cookies from 'js-cookie';

	export let lib;
	
	export function openUserSettingsModal() {
		USER_SETTINGS_MODAL_IS_OPEN = true;
	}
	export function openNewPostModal() {
		NEW_POST_MODAL_IS_OPEN = true;
	}
	let USER_SETTINGS_MODAL_IS_OPEN = false;
	let NEW_POST_MODAL_IS_OPEN = false;
	function closeUserSettingsModal() {
		USER_SETTINGS_MODAL_IS_OPEN = false;
	}
	function closeNewPostModal() {
		NEW_POST_MODAL_IS_OPEN = false;
	}

	export let user;
	export let changed_user = user;
	export let changePosts;
	export let POST_NOTES_DISPLAY_LIMIT;
	export let changePostNotesDisplayLimit;

	export let user_logged_in;

	let posts = lib.queryAllPosts();

	let user_settings = {
		name: user.name,
		discriminator: user.discriminator,
		email: user.email,
		password: ''
	}

	let USER_SETTINGS_CHANGE_ERROR_MESSAGE = '';
	function changeUserSettings() {
		if (user_settings.name.length < 2 || user_settings.name.length > 32) {
			USER_SETTINGS_CHANGE_ERROR_MESSAGE = 'Your name must be between 2 and 32 characters in length.';
		} else if (user_settings.discriminator.length < 2 || user_settings.discriminator.length > 32) {
			USER_SETTINGS_CHANGE_ERROR_MESSAGE = 'Your discriminator must be between 2 and 32 characters in length.';
		} else if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(user_settings.email))) {
			USER_SETTINGS_CHANGE_ERROR_MESSAGE = 'The e-mail you entered is not valid.';				
		} else {
			let valid_password = true;
			if (user_settings.password.length >= 1) {
				if (user_settings.password.length < 8) {
					valid_password = false;
					USER_SETTINGS_CHANGE_ERROR_MESSAGE = 'Your password must be at least 8 characters long.';
				}
			}
			if (valid_password) {
				let email_query = false;
				if (user_settings.email != user.email) {
					email_query = lib.queryUsersWithEmail(user_settings.email);
				}
				if (email_query && email_query[0]) {
					USER_SETTINGS_CHANGE_ERROR_MESSAGE = 'There is already an account registered with this email.';					
				} else {
					if (user_settings.password.length > 1) {
						lib.updateUser(user.email, user_settings);
					} else {
						lib.updateUser(user, user_settings, true);
					}

					Cookies.set('user', JSON.stringify(
						{
							name: user_settings.name,
							discriminator: user_settings.discriminator,
							email: user_settings.email
						}
					));

					user.name = user_settings.name;
					user.discriminator = user_settings.discriminator;
					user.email = user_settings.email;

					changed_user = user;
				}

				closeUserSettingsModal();
			}
		}
	}

	let newPostImageInput, NEW_POST_IMAGE;
	const changeNewPostImage = (e) => {
	  	let image = e.target.files[0];
        let reader = new FileReader();

        reader.onload = e => {
             NEW_POST_IMAGE = e.target.result;
        };

        reader.readAsDataURL(image);
	}
	let NEW_POST_TITLE, NEW_POST_DESCRIPTION;
	function newPost() {
		if (NEW_POST_IMAGE) {
			let valid_title = true, valid_description = true;
			if (NEW_POST_TITLE && NEW_POST_TITLE.length) {
				if (NEW_POST_TITLE.length == 0 || NEW_POST_TITLE.length > 80) {
					valid_title = false;
				}
			}
			if (NEW_POST_DESCRIPTION && NEW_POST_DESCRIPTION.length) {
				if (NEW_POST_DESCRIPTION.length == 0 || NEW_POST_DESCRIPTION.length > 240) {
					valid_description = false;
				}
			}
			if (valid_title && valid_description) {
				const post = lib.insertPost({image_blob: NEW_POST_IMAGE, title: NEW_POST_TITLE, description: NEW_POST_DESCRIPTION, impels: 0, impelled: false, poster_name: user.name, poster_discriminator: user.discriminator, posted_timestamp: new Date().getTime(), notes: []});
				posts = [post, ...posts]
				changePosts(posts);

				POST_NOTES_DISPLAY_LIMIT = [...POST_NOTES_DISPLAY_LIMIT, 3];
				changePostNotesDisplayLimit(POST_NOTES_DISPLAY_LIMIT);

				closeNewPostModal();
			}
		}
	}

	function logout() {
		user_logged_in = false;
		Cookies.remove('user');
	}
</script>

{#if (!(user === false) && (USER_SETTINGS_MODAL_IS_OPEN || NEW_POST_MODAL_IS_OPEN))}
	<div on:click={closeNewPostModal} on:click={closeUserSettingsModal} style="position: fixed; z-index: 2; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8);">
		{#if USER_SETTINGS_MODAL_IS_OPEN}
			<div on:click|stopPropagation style="margin: 60px auto; width: 500px; padding: 30px 40px; background-color: var(--primary-primary-color); border-radius: 8px; box-sizing: border-box;">
				<div style="display: flex;">
					<span style="margin: auto 0; font-size: 18px; font-weight: 900;">USER SETTINGS</span>
					<svg on:click={closeUserSettingsModal} id="user-settings-close-icon" style="margin-left: auto; width: 24px; height: 24px;" xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Close</title><path fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32' d='M368 368L144 144M368 144L144 368'/></svg>
				</div>
				<div style="margin-top: 30px;">
					<input bind:value={user_settings.email} style="width: 100%; padding: 12px 18px; background-color: var(--primary-secondary-color); border: 1px solid var(--secondary-primary-color); border-radius: 4px; outline: none;" placeholder="E-mail">
					<input bind:value={user_settings.password} style="margin-top: 10px; width: 100%; padding: 12px 18px; background-color: var(--primary-secondary-color); border: 1px solid var(--secondary-primary-color); border-radius: 4px; outline: none;" placeholder="Password (hidden)" type="password">
				</div>
				<div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid var(--secondary-secondary-color);">
					<img style="width: 90px; height: 90px; border-radius: 100%; background-color: var(--theme-color);">
					<div style="margin-top: 10px; display: flex; background-color: var(--primary-secondary-color); border: 1px solid var(--secondary-primary-color); border-radius: 4px;">
						<input bind:value={user_settings.name} style="width: 100%; padding: 12px 18px; background-color: transparent; border: 0; outline: none;" placeholder="Name" maxlength="32">
						<div style="position: relative;">
							<svg style="position: absolute; top: -8px; left: 18px; width: 18px; height: 18px; background-color: var(--secondary-primary-color); border-radius: 100%; color: var(--tertiary-secondary-color;" xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>At</title><path d='M320 254.27c-4.5 51-40.12 80-80.55 80s-67.34-35.82-63.45-80 37.12-80 77.55-80 70.33 36 66.45 80z' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/><path d='M319.77 415.77c-28.56 12-47.28 14.5-79.28 14.5-97.2 0-169-78.8-160.49-176s94.31-176 191.51-176C381 78.27 441.19 150 432.73 246c-6.31 71.67-52.11 92.32-76.09 88.07-22.56-4-41.18-24.42-37.74-63.5l8.48-96.25' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/></svg>
							<input bind:value={user_settings.discriminator} style="width: 100%; padding: 12px 18px; background-color: var(--secondary-primary-color); border: 0; outline: none; color: var(--tertiary-secondary-color);" placeholder="Discriminator" maxlength="32">
						</div>
					</div>
				</div>
				<div style="display: flex; margin-top: 30px; padding-top: 30px; border-top: 1px solid var(--secondary-secondary-color);">
					<div on:click={logout} id="user-settings-logout" style="display: flex; margin-top: auto;">
						<svg style="width: 18px; height: 18px; color: #f53d59;" xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Log Out</title><path d='M304 336v40a40 40 0 01-40 40H104a40 40 0 01-40-40V136a40 40 0 0140-40h152c22.09 0 48 17.91 48 40v40M368 336l80-80-80-80M176 256h256' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/></svg>
						<span style="margin-left: 5px; font-size: 14px; font-weight: 700; color: #f53d59;">Log Out</span>
					</div>
					<div style="display: flex; margin-left: auto;">
						<span on:click={closeUserSettingsModal} id="user-settings-cancel" style="margin: auto 0 auto auto; font-weight: 700; color: var(--tertiary-primary-color);">Cancel</span>
						<button on:click={changeUserSettings} id="save-user-settings-button" style="margin-left: 15px; padding: 8px 14px; background-color: var(--theme-color); border: 0; border-radius: 4px; font-weight: 700; color: var(--primary-primary-color);">Save</button>
					</div>
				</div>
				{#if USER_SETTINGS_CHANGE_ERROR_MESSAGE}
					<div style="display: flex; justify-content: center; align-items: center; margin-top: 10px; height: 34px; background-color: #f53d59; border-radius: 4px;">
						<svg style="width: 14px; height: 14px; color: var(--primary-primary-color);" xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Alert</title><path d='M256 80c-8.66 0-16.58 7.36-16 16l8 216a8 8 0 008 8h0a8 8 0 008-8l8-216c.58-8.64-7.34-16-16-16z' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/><circle cx='256' cy='416' r='16' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/></svg>
						<span style="margin-left: 10px; font-size: 12px; color: var(--primary-primary-color);">{USER_SETTINGS_CHANGE_ERROR_MESSAGE}</span>
					</div>
				{/if}
			</div>
		{:else if NEW_POST_MODAL_IS_OPEN}
			<div on:click|stopPropagation style="margin: 60px auto; width: 500px; padding: 30px 40px; background-color: var(--primary-primary-color); border-radius: 8px; box-sizing: border-box;">
				<input style="display:none" type="file" accept=".jpg, .jpeg, .png" on:change={(e) => changeNewPostImage(e)} bind:this={newPostImageInput}>
				{#if NEW_POST_IMAGE}
					<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 200px; background-color: var(--primary-secondary-color); border: 1px solid var(--secondary-primary-color); border-radius: 8px;">
						<img style="max-width: 100%; max-height: 100%;" src={NEW_POST_IMAGE}>
					</div>
				{:else}
					<div on:click={() => newPostImageInput.click()} style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 200px; background-color: var(--primary-secondary-color); border: 1px solid var(--secondary-primary-color); border-radius: 8px;" id="new-post-upload-image">
						<svg style="width: 50px; height: 50px; color: var(--tertiary-secondary-color);" xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Image</title><rect x='48' y='80' width='416' height='352' rx='48' ry='48' fill='none' stroke='currentColor' stroke-linejoin='round' stroke-width='32'/><circle cx='336' cy='176' r='32' fill='none' stroke='currentColor' stroke-miterlimit='10' stroke-width='32'/><path d='M304 335.79l-90.66-90.49a32 32 0 00-43.87-1.3L48 352M224 432l123.34-123.34a32 32 0 0143.11-2L464 368' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/></svg>
						<span style="margin-top: 15px; font-size: 16px; font-weight: 700; color: var(--tertiary-secondary-color);">CLICK TO SELECT AND UPLOAD AN IMAGE</span> 
					</div>
				{/if}
				<div style="margin-top: 30px;">
					<input bind:value={NEW_POST_TITLE} style="width: 100%; padding: 12px 18px; background-color: var(--primary-secondary-color); border: 1px solid var(--secondary-primary-color); border-radius: 4px; outline: none;" placeholder="Title (optional)" maxlength="80">
					<textarea bind:value={NEW_POST_DESCRIPTION} style="margin-top: 10px; width: 100%; padding: 12px 18px; background-color: var(--primary-secondary-color); border: 1px solid var(--secondary-primary-color); border-radius: 4px; outline: none;" placeholder="Description (optional)" rows="4" maxlength="240" resize="none"></textarea>
				</div>
				<div style="display: flex; margin-top: 30px;">
					<span on:click={closeNewPostModal} id="new-post-cancel" style="margin: auto 0 auto auto; font-weight: 700; color: var(--tertiary-primary-color);">Cancel</span>
					<button on:click={newPost} style="margin-left: 15px; padding: 8px 14px; background-color: var(--theme-color); border: 0; border-radius: 4px; font-weight: 700; color: var(--primary-primary-color);" id="new-post-post-button">Post</button>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	#save-user-settings-button:hover {
		cursor: pointer;
		background-color: var(--theme-color-strong) !important;
	}
	#user-settings-logout:hover {
		cursor: pointer;
	}
	#user-settings-logout:hover > * {
		color: #de3c55 !important;
	}
	#user-settings-cancel:hover {
		cursor: pointer;
		color: var(--tertiaray-secondary-color) !important;
	}
	#new-post-upload-image:hover {
		cursor: pointer;
		background-color: var(--primary-tertiary-color) !important;
		border-color: var(--secondary-tertiary-color) !important;
	}
	#new-post-cancel:hover {
		cursor: pointer;
		color: var(--tertiaray-secondary-color) !important;
	}
	#new-post-post-button:hover {
		cursor: pointer;
		background-color: var(--theme-color-weak) !important;
	}
	#user-settings-close-icon:hover {
		cursor: pointer;
		color: var(--tertiary-secondary-color) !important;
	}
</style>