<script lang="ts">
  import { getGraph } from "$lib/graph.svelte";
  import { Button } from "./ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
  import { Input } from "./ui/input";
  import { Label } from "./ui/label";

  const graph = getGraph()

  let nodeName = $state('')

  const handleAddNode = () => {
    graph.addNode(nodeName)
    nodeName = ''
  }
</script>

<Card>
  <CardHeader>
    <CardTitle>Adicionar Vértice</CardTitle>
  </CardHeader>
  <CardContent>
    <div>
      <Label for="new-node">Nome do Vértice</Label>
      <div class="flex space-x-2">
        <Input id="new-node" placeholder="Nome do Vértice" bind:value={nodeName}  />
        <Button disabled={nodeName === ''} onclick={handleAddNode}>Adicionar</Button>
      </div>
    </div>
  </CardContent>
</Card>