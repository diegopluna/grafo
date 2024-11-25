<script lang="ts">
  import { getGraph } from "$lib/graph.svelte";
  import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
  import { Input } from "./ui/input";


  const graph = getGraph()

  async function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]

    if (file) {
      const text = await file.text()
      const lines = text.split('\n')

      graph.clearGraph()

      const nodes = new Set<string>()

      for (let i =1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line) {
          const [source, target, weight] = line.split(',')

          if (!nodes.has(source)) {
            graph.addNode(source)
            nodes.add(source)
          }
          if (!nodes.has(target)) {
            graph.addNode(target)
            nodes.add(target)
          }

          graph.addLink(source, target, Number(weight))
        }
      }
    }
  }
</script>

<Card>
  <CardHeader>
    <CardTitle>Importar Grafo</CardTitle>
  </CardHeader>
  <CardContent>
    <Input type="file" accept=".csv, .txt" onchange={handleFileSelect} />
    <p class="mt-2 text-sm text-gray-500">
      Format: Source, Target, Weight
    </p>
  </CardContent>
</Card>