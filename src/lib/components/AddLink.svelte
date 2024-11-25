<script lang="ts">
  import { getGraph } from "$lib/graph.svelte";
  import { derived, writable} from "svelte/store";
  import { Button } from "./ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
  import { Input } from "./ui/input";
  import { Label } from "./ui/label";
  import * as Select from "./ui/select";

  const graph = getGraph()

  let source = writable('')
  let target = writable('')
  let weight = $state(1)

  const possibleSources = derived([graph.nodes, target], ([$nodes, $target]) => $nodes.filter(n => n.id !== $target))
  const possibleTargets = derived([graph.nodes, source], ([$nodes, $source]) => $nodes.filter(n => n.id !== $source))

  const sourceTriggerContent = derived([graph.nodes, source], ([$nodes, $source]) =>
    $nodes.find((n) => n.id === $source)?.id ?? 'Selecione um vértice',
  )
  const targetTriggerContent = derived([graph.nodes, target], ([$nodes, $target]) =>
    $nodes.find((n) => n.id === $target)?.id ?? 'Selecione um vértice',
  )

  const handleAddLink = () => {
    graph.addLink($source, $target, weight)
    source.set('')
    target.set('')
    weight = 1
  }

</script>

<Card>
  <CardHeader>
    <CardTitle>Adicionar Aresta</CardTitle>
  </CardHeader>
  <CardContent>
    <div class="flex flex-col space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <Label for="source-node">Vértice de Origem</Label>
          <Select.Root type="single" name="source-node" bind:value={$source}>
            <Select.Trigger>
              {$sourceTriggerContent}
            </Select.Trigger>
            <Select.Content>
              {#each $possibleSources as possibleSource}
                <Select.Item value={possibleSource.id} label={possibleSource.id}>{possibleSource.id}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
        <div>
          <Label for="target-node">Vértice de Destino</Label>
          <Select.Root type="single" name="target-node" bind:value={$target}>
            <Select.Trigger>
              {$targetTriggerContent}
            </Select.Trigger>
            <Select.Content>
              {#each $possibleTargets as possibleTarget}
                <Select.Item value={possibleTarget.id} label={possibleTarget.id}>{possibleTarget.id}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
      </div>
      <div>
        <Label for="edge-weight">Peso da Aresta</Label>
        <Input id="edge-weight" type="number" bind:value={weight} min={1} />
      </div>
      <Button disabled={
        $source === '' ||
        $target === '' ||
        $source === $target
      } onclick={handleAddLink}>Adicionar Aresta</Button>
    </div>
  </CardContent>
</Card>