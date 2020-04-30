<script>

  import { GlobalCSS } from 'figma-plugin-ds-svelte';
  import { fade, fly } from 'svelte/transition';
  import styles from './styles.css';
  import { Button, Input, Label, Switch, Textarea, Icon, IconAdjust, IconSmiley, Radio, IconButton } from 'figma-plugin-ds-svelte';

  let commentator;
  let message = null;
  let yourName = 'Namey McNamerson';
  let comment = 'Comment...';
  let radioValue = 'blue';
  let switchValue = false;
  let retroValue = false;
  let emojiValue;
  let add = 'add';
  let seticon = 'seticon';
  let username = null;
  let filename = 'this frame'

  let settings = { settingsOn: false };
  let emojis = { emojisOn: false };

  function toggle() {
    settings.settingsOn = !settings.settingsOn;
  }

  function emojiToggle() {
    emojis.emojisOn = !emojis.emojisOn;
  }

  function emojiChange() {
    emojis = { emojisOn: false};

    if (message === null) {
      message = emojiValue;
    } else {
      message = message + emojiValue;
    } 
  }

  function addMessage() {
    parent.postMessage({ pluginMessage: { 
      'type': 'add-message', 
      'switch': switchValue,
      'message': message,
      'name': username,
      'color': radioValue
    } }, '*');
    
    setTimeout(function(){ 
      message = null;
      }, 
    100);
  }

  window.onmessage = async (event) => {
    if (event.data.pluginMessage.commentator === false) {
      switchValue = false;
    }

    if (event.data.pluginMessage.commentator === true) {
      switchValue = true;
    }

    if (event.data.pluginMessage.color) {
      radioValue = event.data.pluginMessage.color
    }

    if (event.data.pluginMessage.name) {
      username = event.data.pluginMessage.name
    }

    if (event.data.pluginMessage.getfile) {
      filename = event.data.pluginMessage.getfile
    }

  }

</script>

<div class="wrapper p-xxsmall">

  {#if !settings.settingsOn}

    <IconButton iconName={IconAdjust} on:click={toggle} bind:class={seticon}/>
    <div class="content">

    {#if username <=0 }

      <div class="username placeholder" on:click={toggle}>
        <span>(Set your name)</span>
      </div>
      <span class="role" on:click={toggle}>Set your name to add comments</span>

      {:else}

      <div class="username {radioValue} {switchValue}" on:click={toggle}>
        <span>{username}</span>
      </div>
      {#if !switchValue}
      <span class="role">participant</span>
      {:else}
      <span class="role">owner 👑</span>
      {/if}
      <div class="comment">Add your comments for <span># {filename}</span></div>

      <div class="footer {switchValue}">
        <Input bind:placeholder={comment} bind:value={message} class="message-input {radioValue} {switchValue}"/>
        <div class="message-holder">

        {#if !emojis.emojisOn}
          <div></div>
        {/if}
        {#if emojis.emojisOn}
        <div class="emoji" transition:fly="{{ y: 10, duration: 200 }}">
          <Radio bind:group={emojiValue} on:change={emojiChange} value="🦄"></Radio>
          <Radio bind:group={emojiValue} on:change={emojiChange} value="💚"></Radio>
          <Radio bind:group={emojiValue} on:change={emojiChange} value="🙂"></Radio>
          <Radio bind:group={emojiValue} on:change={emojiChange} value="🙁"></Radio>
          <Radio bind:group={emojiValue} on:change={emojiChange} value="👍"></Radio>
          <Radio bind:group={emojiValue} on:change={emojiChange} value="👎"></Radio>
        </div>
        {/if}
        
        {#if message <=0 }
          <IconButton on:click={emojiToggle} iconName={IconSmiley}/>
        {:else}
          <IconButton on:click={emojiToggle} iconName={IconSmiley}/>
          <Button on:click={addMessage} bind:class={radioValue}>Add</Button>
        {/if}
        </div>
      </div>

    {/if}

    </div>

  {/if}

  {#if settings.settingsOn}
  <h4>Settings</h4>
  <Input bind:placeholder={yourName} iconName={IconSmiley} bind:value={username} class="mb-xxsmall"/>
  <div class="switch-holder">
    <Switch value="false" bind:checked={switchValue}>Chat owner</Switch>
  </div>

  <div class="colors {switchValue}">
    <Radio bind:group={radioValue} value="yellow"></Radio>
    <Radio bind:group={radioValue} value="orange"></Radio>
    <Radio bind:group={radioValue} value="red"></Radio>
    <Radio bind:group={radioValue} value="indigo"></Radio>
    <Radio bind:group={radioValue} value="blue"></Radio>
    <Radio bind:group={radioValue} value="green"></Radio>
    <Radio bind:group={radioValue} value="purple"></Radio>
    <Radio bind:group={radioValue} value="lavender"></Radio>
    <Radio bind:group={radioValue} value="whaletail" ></Radio>
    <Radio bind:group={radioValue} value="lime"></Radio>
  </div>

  <div class="button-holder">
    <Button on:click={toggle} variant="secondary">Back</Button>
    <Button on:click={toggle} bind:class={add}>Update</Button>
  </div>
  {/if}
  
</div>