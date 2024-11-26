<script lang="ts">
  import { getGraph } from "$lib/graph.svelte";
  import { derived, get } from "svelte/store";
  import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

  const graph = getGraph()

  const order = derived(graph.nodes, ($nodes) => $nodes.length)
  const size = derived(graph.edges, ($edges) => $edges.length)

  const directional = derived(graph.isDirectional, ($isDirectional) => $isDirectional)
  const weighted = derived(graph.isValueWeighted, ($isValueWeighted) => $isValueWeighted)

  const isEulerien = derived(
    [graph.nodes, graph.edges, graph.isDirectional],
    () => graph.checkEulerian()
  )


</script>

<Card>
    <CardHeader>
        <CardTitle>Informações do Grafo</CardTitle>
    </CardHeader>
    <CardContent>
      <div>
        <p><strong>Ordem (Número de Vértices): {$order}</strong></p>
        <p><strong>Tamanho (Número de Arestas): {$size}</strong></p>
        <p><strong>É direcionado: {$directional ? 'Sim' : 'Não'}</strong></p>
        <p><strong>É ponderado: {$weighted ? 'Sim' : 'Não'}</strong></p>
        <p><strong>É Euleriano: {$isEulerien ? 'Sim' : 'Não'}</strong></p>
      </div>
    </CardContent>
</Card>