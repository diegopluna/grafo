<script lang="ts">
  import { getGraph } from "$lib/graph.svelte";
  import { derived as storeDerived } from "svelte/store";
  import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
  import * as Select from "./ui/select";
  import { Button } from "./ui/button";


  interface Result {
    cost: number
    path: string[]
  }

  let startVertex = $state<string | undefined>(undefined)
  let endVertex = $state<string | undefined>(undefined)
  let result = $state<Result | undefined>(undefined)

  const graph = getGraph()

  const nodes = storeDerived(graph.nodes, ($nodes) => $nodes)

  const startVertexTriggerContent = $derived($nodes.find(node => node.id === startVertex)?.id ?? "Selecione um vértice")
  const endVertexTriggerContent = $derived($nodes.find(node => node.id === endVertex)?.id ?? "Selecione um vértice")

  const handleFindPath = () => {
    if (startVertex && endVertex) {
      result = graph.findShortestPath(startVertex, endVertex)
    }
  }

</script>

<Card>
  <CardHeader>
    <CardTitle>Caminho mais curto</CardTitle>
  </CardHeader>
  <CardContent>
    <div>
      <h2 class="text-lg font-bold mb-4">Caminho mais curto</h2>
      <div class="grid grid-cols-2 gap-4">
        <Select.Root type="single" name="startVertex" bind:value={startVertex}>
          <Select.Trigger>
            {startVertexTriggerContent}
          </Select.Trigger>
          <Select.Content>
            {#each $nodes as node}
              <Select.Item value={node.id} label={node.id}>{node.id}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
        <Select.Root type="single" name="endVertex" bind:value={endVertex}>
          <Select.Trigger>
            {endVertexTriggerContent}
          </Select.Trigger>
          <Select.Content>
            {#each $nodes as node}
              <Select.Item value={node.id} label={node.id}>{node.id}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
        <Button onclick={handleFindPath} disabled={!startVertex || !endVertex}>
          Encontrar caminho mais curto
        </Button>

        {#if result !== undefined}
          <div class="mt-4">
            <p><strong>Custo do Caminho:</strong> {result.cost === Infinity ? 'Infinito (Sem Caminho)' : result.cost}</p>
            <p><strong>Caminho:</strong> {result.path.length === 0 ? 'Nenhum' : result.path.join(' → ')}</p>
          </div>       
        {/if}
      </div>
    </div>
  </CardContent>
</Card>