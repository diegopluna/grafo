<script lang="ts">
  import { getGraph } from "$lib/graph.svelte";
  import { derived as storeDerived } from "svelte/store";
  import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
  import * as Select from "./ui/select";

  interface Adjacent {
    incoming: string[]
    outgoing: string[]
  }

  interface Degree {
    incoming: number
    outgoing: number
    total: number
  }

  let selectedNode = $state<string | undefined>(undefined)
  let adjacents = $state<Adjacent | undefined>(undefined)
  let degree = $state<Degree | undefined>(undefined)

  const graph = getGraph()

  const nodes = storeDerived(graph.nodes, ($nodes) => $nodes)

  const nodeTriggerContent = $derived($nodes.find(node => node.id === selectedNode)?.id ?? "Selecione um vértice")

  const handleValueChange = (value: string) => {
    selectedNode = value
    adjacents = graph.getAdjacentVertices(value)
    degree = graph.getVertexDegree(value)
  }

</script>

<Card>
  <CardHeader>
    <CardTitle>Adjacências e Grau</CardTitle>
  </CardHeader>
  <CardContent>
    <div>
      <h2 class="text-lg font-bold mb-4">Adjacências e Grau</h2>
      <Select.Root type="single" name="node" value={selectedNode} onValueChange={(value) => handleValueChange(value)}>
        <Select.Trigger>
          {nodeTriggerContent}
        </Select.Trigger>
        <Select.Content>
          {#each $nodes as node}
            <Select.Item value={node.id} label={node.id}>{node.id}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>

      {#if adjacents !== undefined && degree !== undefined}
        <div class="mt-4">
          <p><strong>Adjacentes de Entrada:</strong> {adjacents.incoming || 'Nenhum'}</p>
          <p><strong>Adjacentes de Saída:</strong> {adjacents.outgoing || 'Nenhum'}</p>
          <p class="mt-2"><strong>Grau de Entrada: {degree.incoming}</strong></p>
          <p><strong>Grau de Saída: {degree.outgoing}</strong></p>
          <p><strong>Grau Total: {degree.total}</strong></p>
        </div>
      {/if}

    </div>
  </CardContent>
</Card>