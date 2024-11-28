<script lang="ts">
  import { getGraph } from "$lib/graph.svelte";
  import { derived } from "svelte/store";
  import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
  import { Button } from "./ui/button";

  const graph = getGraph()

  const isDirectional = derived(graph.isDirectional, ($isDirectional) => $isDirectional)
  const nodes = derived(graph.nodes, ($nodes) => $nodes)
  const edges = derived(graph.edges, ($edges) => $edges)

</script>

<Card>
  <CardHeader>
    <CardTitle>Lista de Elementos</CardTitle>
  </CardHeader>
  <CardContent>
    <div class="grid md:grid-cols-2 gap-8 mb-8 overflow-y-auto h-[300px]" >
      <div>
        <h3>Vértices</h3>
        <ul>
          {#each $nodes as node}
            <li class="mt-2">
              {node.id}
              <Button variant="secondary" onclick={() => graph.removeNode(node.id)}>Remover</Button>
            </li>
          {/each}
        </ul>
      </div>
      <div>
        <h3>Arestas</h3>
        <ul>
          {#each $edges as edge}
            <li class="mt-2">
              {edge.source} {#if $isDirectional} -> {:else} -- {/if} {edge.target} (Peso: {edge.label})
              <Button variant="secondary" onclick={() => graph.removeLink(edge.source, edge.target)}>Remover</Button>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </CardContent>
</Card>