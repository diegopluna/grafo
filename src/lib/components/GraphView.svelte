<script lang="ts">
  import { Background, Controls, SvelteFlow } from "@xyflow/svelte";
  import { Card, CardTitle, CardHeader, CardContent } from "./ui/card";
  import { getGraph } from "$lib/graph.svelte";
  import { writable } from "svelte/store";

  const graph = getGraph()

  const snapGrid: [number, number] = [25, 25]

</script>

<Card class="mt-8">
  <CardHeader>
    <CardTitle>Visualização do Grafo</CardTitle>
  </CardHeader>
  <CardContent>
      <div class="w-full h-[800px] border border-gray-200 rounded-lg p-4">
        <SvelteFlow 
          nodes={graph.nodes} 
          edges={graph.edges} 
          {snapGrid}
          fitView
        >
            <Background />
            <Controls />
        </SvelteFlow>
      </div> 
  </CardContent>
</Card>