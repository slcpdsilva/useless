<script>
	import * as utils from './utils.js';

	import * as lib from './lib.js';

	import Cookies from 'js-cookie';

	import { push } from 'svelte-spa-router';

	import Header from './Header.svelte';
	import Modal from './Modal.svelte';

	const users = lib.queryAllUsers();

	var posts = lib.queryAllPosts();
	let POST_NOTES_DISPLAY_LIMIT = new Array(posts.length + 1);
	POST_NOTES_DISPLAY_LIMIT.fill(3);

	function changePosts(changed_posts) {
		posts = changed_posts;
	}
	function changePostNotesDisplayLimit(changed_posts_notes_display_limits) {
		POST_NOTES_DISPLAY_LIMIT = changed_posts_notes_display_limits;
	}

	var user = false;
	if (Cookies.get('user')) {
		user = JSON.parse(Cookies.get('user'));
	}
	let closeUserTooltip;
	let openUserSettingsModal;

	let openNewPostModal;

	function impelPost(post_id, index) {
		const {impels, impelled} = lib.updateImpelPost(post_id);
		posts[index].impels = impels;
		posts[index].impelled = impelled;
	}
	let uploadImageAsNoteInput = new Array(posts.length);
	function uploadImageAsNote (e, post_id, index) {
	  	let image = e.target.files[0];
        let reader = new FileReader();

        reader.onload = e => {
			lib.updatePostNotes(post_id, {image_blob: e.target.result, poster_name: user.name, poster_discriminator: user.discriminator, posted_timestamp: new Date().getTime()});				
			posts[index].notes = [{image_blob: e.target.result, poster_name: user.name, poster_discriminator: user.discriminator, posted_timestamp: new Date().getTime()}, ...posts[index].notes];
        };

        reader.readAsDataURL(image);
	}
</script>

<Modal lib={lib} user={user} bind:user_logged_in={user} posts={posts} POST_NOTES_DISPLAY_LIMIT={POST_NOTES_DISPLAY_LIMIT} changePostNotesDisplayLimit={changePostNotesDisplayLimit} changePosts={changePosts} bind:changed_user={user} bind:openUserSettingsModal={openUserSettingsModal} bind:openNewPostModal={openNewPostModal}/>
<Header user={user} openUserSettingsModal={openUserSettingsModal} openNewPostModal={openNewPostModal} bind:closeUserTooltip={closeUserTooltip} />
<div on:click={closeUserTooltip} style="width: 100%; height: 100%;">
	<div style="margin: 0 auto; max-width: 1000px; padding: 0 60px;">
		{#each posts as post, index}
			<div style="display: flex; padding: 60px 0;">
				<div style="width: 50%;">
					<div style="padding-bottom: 100%; border: 1px solid var(--secondary-secondary-color); border-radius: 8px; background-image: url({post.image_blob}); background-size: contain; background-position: center; background-repeat: no-repeat;">
					</div>
					<div style="display: flex; margin-top: -20px;">
						{#if user}
							{#if post.impelled}
								<div on:click={() => impelPost(post.ID, index)} style="position: relative; display: flex; flex-direction: column; margin: auto; width: 40px; height: 40px; background-color: var(--primary-primary-color); border: 4px solid var(--theme-color-weak); border-top-left-radius: 25%; border-top-right-radius: 25%; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;" id="impel-post">
									<span style="margin: auto; font-weight: 900; color: var(--theme-color-weak);">{post.impels}</span>
								</div>
							{:else}
								<div on:click={() => impelPost(post.ID, index)} style="position: relative; display: flex; flex-direction: column; margin: auto; width: 40px; height: 40px; background-color: var(--primary-primary-color); border: 4px solid var(--theme-color); border-top-left-radius: 25%; border-top-right-radius: 25%; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;" id="impel-post">
									<span style="margin: auto; font-weight: 900; color: var(--theme-color);">{post.impels}</span>
								</div>
							{/if}
						{:else}
							<div on:click={() => push('/register')} style="position: relative; display: flex; flex-direction: column; margin: auto; width: 40px; height: 40px; background-color: var(--primary-primary-color); border: 4px solid var(--theme-color); border-top-left-radius: 25%; border-top-right-radius: 25%; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;" id="impel-post">
								<span style="margin: auto; font-weight: 900; color: var(--theme-color);">{post.impels}</span>
							</div>							
						{/if}
					</div>
					{#if (post.title || post.description)}
						<div style="display: flex; flex-direction: column; margin-top: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--secondary-secondary-color);">
							{#if (post.title)}
								<span style="font-size: 18px; font-weight: 700;">{post.title}</span>
							{/if}
							{#if (post.description)}
								<span style="margin-top: 5px; color: var(--tertiary-secondary-color);">{post.description} <span class="link" style="color: var(--theme-color);">#perseverance</span></span>
							{/if}
						</div>
					{/if}
					<div style="display: flex; margin-top: 15px; padding-top: 10px;">
						<img class="mini-user-profile-avatar" style="width: 30px; height: 30px; border-radius: 100%; background-color: var(--theme-color);">
						<div class="mini-user-profile-name" style="display: flex; flex-direction: column; justify-content: space-between; margin-left: 12px;">
							<span style="margin-top: -3px; font-weight: 700;">{post.poster_name}</span>
							<span style="font-size: 12px; color: var(--tertiary-tertiary-color);">@{post.poster_discriminator}</span>
						</div>
						<div style="margin-left: auto;">
							<span style="font-size: 12px; color: var(--tertiary-secondary-color);">{utils.fromNow(post.posted_timestamp)}</span>
						</div>
					</div>
				</div>	
				<div style="flex: 1; padding-left: 30px;">
					{#if (user)}
						<input style="display:none" type="file" accept=".jpg, .jpeg, .png" on:change={(e) => uploadImageAsNote(e, post.ID, index)} bind:this={uploadImageAsNoteInput[post.ID]}>
						<div on:click={() => uploadImageAsNoteInput[post.ID].click()} id="upload-image-as-note" style="display: flex; justify-content: center; padding: 20px 30px; background-color: var(--primary-secondary-color); border: 1px solid var(--secondary-secondary-color); border-radius: 8px;">
							<svg style="width: 18px; height: 18px; color: var(--tertiary-tertiary-color);" xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Image</title><rect x='48' y='80' width='416' height='352' rx='48' ry='48' fill='none' stroke='currentColor' stroke-linejoin='round' stroke-width='32'/><circle cx='336' cy='176' r='32' fill='none' stroke='currentColor' stroke-miterlimit='10' stroke-width='32'/><path d='M304 335.79l-90.66-90.49a32 32 0 00-43.87-1.3L48 352M224 432l123.34-123.34a32 32 0 0143.11-2L464 368' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/></svg>
							<span style="margin-left: 10px; font-weight: 700; color: var(--tertiary-tertiary-color);">CLICK TO SELECT AND UPLOAD AN IMAGE AS A NOTE</span> 
						</div>	
					{:else}
						<div on:click={() => push('/register')} id="upload-image-as-note" style="display: flex; justify-content: center; padding: 20px 30px; background-color: var(--primary-secondary-color); border: 1px solid var(--secondary-secondary-color); border-radius: 8px;">
							<svg style="width: 18px; height: 18px; color: var(--tertiary-tertiary-color);" xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Image</title><rect x='48' y='80' width='416' height='352' rx='48' ry='48' fill='none' stroke='currentColor' stroke-linejoin='round' stroke-width='32'/><circle cx='336' cy='176' r='32' fill='none' stroke='currentColor' stroke-miterlimit='10' stroke-width='32'/><path d='M304 335.79l-90.66-90.49a32 32 0 00-43.87-1.3L48 352M224 432l123.34-123.34a32 32 0 0143.11-2L464 368' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/></svg>
							<span style="margin-left: 10px; font-weight: 700; color: var(--tertiary-tertiary-color);">CLICK TO SELECT AND UPLOAD AN IMAGE AS A NOTE</span> 
						</div>	
					{/if}	
					<div style="display: flex; margin-top: 20px;">			
						<span style="font-size: 18px; font-weight: 700;">Notes</span>
						<span style="margin-left: auto; font-size: 18px; color: var(--tertiary-tertiary-color);">{post.notes.length}</span>
					</div>
					{#each post.notes as post_note, index}
						{#if index < POST_NOTES_DISPLAY_LIMIT[post.ID]}
							<div style="display: flex; margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--secondary-secondary-color);">
								<img class="mini-user-profile-avatar" style="width: 40px; height: 40px; border-radius: 100%; background-color: var(--theme-color);">
								<div style="display: flex; flex-direction: column; justify-content: space-between; flex: 1; margin-left: 15px;">
									<div style="display: flex;">
										<div class="mini-user-profile-name" style="display: flex;">
											<span style="font-weight: 700;">{post_note.poster_name}</span>
											<span style="margin-left: 5px; color: var(--tertiary-tertiary-color);">@{post_note.poster_discriminator}</span>
										</div>
										<span style="margin-left: 5px; color: var(--tertiary-secondary-color);">{utils.fromNow(post_note.posted_timestamp)}</span>
									</div>
									<img style="margin-top: 10px; max-width: 100%; max-height: 128px; object-fit: contain;" src={post_note.image_blob}>
								</div>
							</div>
						{/if}
					{/each}				
					{#if (post.notes.length > POST_NOTES_DISPLAY_LIMIT[post.ID])}
						<div on:click={() => POST_NOTES_DISPLAY_LIMIT[post.ID] = POST_NOTES_DISPLAY_LIMIT[post.ID] + 50} id="view-more-notes-link" style="display: flex; margin-top: 15px; padding-top: 20px; border-top: 1px solid var(--secondary-secondary-color);">
							<span style="margin: auto 0; font-weight: 700; color: var(--tertiary-tertiary-color);">View more notes</span>
							<svg style="margin-left: auto; width: 18px; height: 18px; color: var(--tertiary-tertiary-color);" xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Arrow Forward</title><path fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M268 112l144 144-144 144M392 256H100'/></svg>	
						</div>	
					{/if}					
				</div>	
			</div>			
		{/each}
	</div>
</div>

<style>
	#view-more-notes-link:hover {
		cursor: pointer;
	}
	#view-more-notes-link:hover > * {
		color: var(--tertiary-secondary-color) !important;
	}
	.impel-note:hover, .upload-image-as-subnote:hover {
		cursor: pointer;
		color: var(--tertiary-tertiary-color) !important;
	}
	#upload-image-as-note:hover {
		cursor: pointer;
		background-color: var(--primary-tertiary-color) !important;
		border-color: var(--secondary-tertiary-color) !important;
	}
	#upload-image-as-note:hover > * {
		color: var(--tertiary-secondary-color) !important;
	}
	.mini-user-profile-avatar:hover {
		cursor: pointer;
	}
	.mini-user-profile-name:hover {
		cursor: pointer;
	}
	#impel-post:hover {
		cursor: pointer;
		border-color: var(--theme-color-weak) !important;
	}
	#impel-post:hover > span {
		color: var(--theme-color-weak) !important;
	}
	#search-results-post:hover {
		cursor: pointer;
		background-color: var(--primary-tertiary-color);
	}
</style>