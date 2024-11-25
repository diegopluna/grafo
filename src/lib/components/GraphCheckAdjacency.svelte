<script lang="ts">
  import { getGraph } from "$lib/graph.svelte";
  import { derived as storeDerived } from "svelte/store";
  import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
  import * as Select from "./ui/select";
  import { Button } from "./ui/button";

  let vertexA = $state<string | undefined>(undefined)
  let vertexB = $state<string | undefined>(undefined)
  let areAdjacent = $state<boolean | undefined>(undefined)


  const graph = getGraph()
  
  const nodes = storeDerived(graph.nodes, ($nodes) => $nodes)

  const vertexATriggerContent = $derived($nodes.find(node => node.id === vertexA)?.id ?? "Selecione um vértice")
  const vertexBTriggerContent = $derived($nodes.find(node => node.id === vertexB)?.id ?? "Selecione um vértice")

  const handleCheck = () => {
    if (vertexA && vertexB) {
      areAdjacent = graph.areVerticesAdjacent(vertexA, vertexB)
    }
  }
</script>

<Card>
  <CardHeader>
    <CardTitle>Verificar Adjacência</CardTitle>
  </CardHeader>
  <CardContent>
    <div>
      <h2 class="text-lg font-bold mb-4">Verificar Adjacência</h2>
      <div class="grid grid-cols-2 gap-4">
        <Select.Root type="single" name="vertexA" bind:value={vertexA}>
          <Select.Trigger>
            {vertexATriggerContent}
          </Select.Trigger>
          <Select.Content>
            {#each $nodes as node}
              <Select.Item value={node.id} label={node.id}>{node.id}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
        <Select.Root type="single" name="vertexB" bind:value={vertexB}>
          <Select.Trigger>
            {vertexBTriggerContent}
          </Select.Trigger>
          <Select.Content>
            {#each $nodes as node}
              <Select.Item value={node.id} label={node.id}>{node.id}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>

        <Button onclick={handleCheck} disabled={!vertexA || !vertexB}>
          Verificar
        </Button>

        {#if areAdjacent !== undefined}
          <p class="mt-4">
            <strong>Resultado:</strong>{' '}
            {areAdjacent ? 'Os vértices são adjacentes' : 'Os vértices não são adjacentes'}
          </p>
        {/if}
      </div>
    </div>
  </CardContent>
</Card>