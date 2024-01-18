<script lang="ts">
  export let prefix: string
  let count: number = 0
  const increment = () => {
    count += 1
  }
</script>

<button on:click={increment}>
  {prefix}: count is {count}
</button>
