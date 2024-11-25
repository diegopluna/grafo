<script lang="ts">
  import AddLink from "$lib/components/AddLink.svelte";
  import AddNode from "$lib/components/AddNode.svelte";
  import GraphAdjacency from "$lib/components/GraphAdjacency.svelte";
  import GraphCheckAdjacency from "$lib/components/GraphCheckAdjacency.svelte";
  import GraphInfo from "$lib/components/GraphInfo.svelte";
  import GraphList from "$lib/components/GraphList.svelte";
  import GraphSetttings from "$lib/components/GraphSetttings.svelte";
  import GraphShortestPath from "$lib/components/GraphShortestPath.svelte";
  import GraphView from "$lib/components/GraphView.svelte";
  import ImportCsv from "$lib/components/ImportCSV.svelte";
  import { setGraph } from "$lib/graph.svelte";
  import "./app.css";
  import '@xyflow/svelte/dist/style.css';

  setGraph()

</script>

<div class="container-mx-auto px-4 py-8">
  <h1 class='text-3xl font-bold mb-8 text-center'>Gerador de Grafo</h1>

  <div class='grid grid-cols-1 md:grid-cols-2 gap-8'>
    <GraphInfo />
    <GraphSetttings />
  </div>

  <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
    <AddNode />
    <AddLink />
  </div>
  <GraphView />

  <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
    <GraphList />
    <GraphAdjacency />
  </div>

  <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
    <GraphCheckAdjacency />
    <GraphShortestPath />
  </div>

  <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
    <ImportCsv />
  </div>
</div>