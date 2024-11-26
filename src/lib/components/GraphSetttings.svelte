<script lang="ts">
  import { getGraph } from "$lib/graph.svelte";
  import { derived } from "svelte/store";
  import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
  import { Label } from "./ui/label";
  import { Switch } from "./ui/switch";

  const graph = getGraph()

  const checked = derived(graph.isDirectional, $isDirectional => $isDirectional)
  const valueWeighted = derived(graph.isValueWeighted, $isValueWeighted => $isValueWeighted)

</script>

<Card>
  <CardHeader>
    <CardTitle>Configurações do Grafo</CardTitle>
  </CardHeader>
  <CardContent class="flex flex-col space-y-2">
    <div class="flex items-center space-x-2">
      <Switch id="directed-mode" checked={$checked} onCheckedChange={(v) => graph.toggleDirectional(v)}  />
      <Label for="directed-mode">Grafo Direcionado</Label>
    </div>
    <div class="flex items-center space-x-2">
      <Switch id="weighted-mode" checked={$valueWeighted} onCheckedChange={(v) => graph.toggleValueWeighted(v)} />
      <Label for="weighted-mode">Grafo Ponderado</Label>
    </div>
  </CardContent>
</Card>