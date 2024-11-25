<script lang="ts">
  import { getGraph } from "$lib/graph.svelte";
  import { derived } from "svelte/store";
  import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
  import { Label } from "./ui/label";
  import { Switch } from "./ui/switch";

  const graph = getGraph()

  const checked = derived(graph.isDirectional, $isDirectional => $isDirectional)

</script>

<Card>
  <CardHeader>
    <CardTitle>Configurações do Grafo</CardTitle>
  </CardHeader>
  <CardContent>
    <div class="flex items-center space-x-2">
      <Switch id="directed-mode" checked={$checked} onCheckedChange={(v) => graph.toggleDirectional(v)}  />
      <Label for="directed-mode">Grafo Direcionado</Label>
    </div>
  </CardContent>
</Card>