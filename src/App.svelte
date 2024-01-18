<script lang="ts">
  import { flip } from 'svelte/animate';
  import { slide } from 'svelte/transition';

  import archetypes from './data/archetypes.json'
  import classes from './data/classes.json'

  let searchValue = '';
  let classNames = Object.values(classes).map(c => c.name).sort();
  let selectedArchetypes = [];

  const addArchetype = (archetype) => {
    if (selectedArchetypes.includes(archetype)) {
      selectedArchetypes.splice(selectedArchetypes.indexOf(archetype), 1);
      selectedArchetypes = [ ...selectedArchetypes ];
      filterClassNames()
      return
    }

    if (selectedArchetypes.length >= 3) return
    selectedArchetypes.push(archetype);
    selectedArchetypes = [ ...selectedArchetypes ];
    filterClassNames()
  }

  const filterClassNames = () => {
    classNames = Object.values(classes).filter(c => {
      const allArchetypesSelected = selectedArchetypes.every(
        selectedArchetype => 
          c.archetypes.includes(archetypes[selectedArchetype].name)
      )

      if (searchValue !== '') {
        return allArchetypesSelected && c.name.toLowerCase().includes(searchValue.toLowerCase())
      }

      return allArchetypesSelected;
    }).map((c) => c.name).sort()
  }

  const selectClass = (className) => {
    if (className === searchValue) {
      searchValue = ''
      selectedArchetypes = []
    } else {
      searchValue = className
      selectedArchetypes = classes[className.toLowerCase().replace(" ", "_")].archetypes.map(a => a.toLowerCase().replace(" ", "_"));
    }
    filterClassNames()
  }

  let description = '';
  $: archetypeDescription = description;
</script>

<main>
  <div id="classes">
    <h1>Classes</h1>
    <input 
      type="text" 
      id="class-input" 
      placeholder="Search Classes" 
      bind:value={searchValue} 
      on:keyup={() => filterClassNames()} 
    />
    <ul>
      {#each classNames as className (className)}
        <li transition:slide>
          <a href="#" on:click={() => selectClass(className)}>{className}</a>
        </li>
      {/each}
    </ul>
  </div>

  <div id="archetypes">
    <h1>Archetypes</h1>
    <div id="archetype-buttons">
      {#each Object.entries(archetypes) as [archetype, option]}
        <button 
          class="archetype {selectedArchetypes.includes(archetype) ? 'selected' : ''}" 
          disabled={!selectedArchetypes.includes(archetype) && selectedArchetypes.length >= 3}
          on:click={() => addArchetype(archetype)} 
          on:mouseenter={() => { description = option.description }}
        >
          <img src={option.image.icon} alt={option.name} />
        </button>
      {/each}
    </div>
  </div>

  <div id="description">
    <h1>Description</h1>
    <p>{archetypeDescription}</p>
  </div>
</main>

<style>
  main {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
    grid-template-rows: 1fr;
    gap: 1rem;
    margin: 0 auto;
    width: 80%;
  }

  #classes {
    height: 100vh;
    overflow-y: scroll;
  }

  .archetype {
    cursor: pointer;
  }

  .archetype:disabled,
  .archetype[disabled] {
    cursor: not-allowed;
    filter: grayscale(1);
  }

  .archetype.selected {
    border: 5px solid #000;
  }

  #archetype-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }
</style>
