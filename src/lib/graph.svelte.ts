import { MarkerType, type Edge, type Node } from "@xyflow/svelte";
import { getContext, setContext } from "svelte";
import { writable, derived, get } from "svelte/store";
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';


export class Graph {
  nodes = writable<Node[]>([])
  edges = writable<Edge[]>([])
  isDirectional = writable<boolean>(false)
  isValueWeighted = writable<boolean>(true)
  simulation: any

  constructor() {
    this.simulation = forceSimulation()
    .force('charge', forceManyBody().strength(-300))
    .force('center', forceCenter(250, 250))
    .force('link', forceLink().id((d: any) => d.id).distance(100))
    .on('tick', () => {
      this.nodes.update(nodes => {
        nodes.forEach(node => {
          if (node.position && (node as any).x && (node as any).y) {
            node.position.x = (node as any).x
            node.position.y = (node as any).y
          }
        })
        return nodes
      })
    })
  }

  clearGraph() {
    this.nodes.set([])
    this.edges.set([])
    this.simulation.nodes([])
    this.simulation.force('link').links([])
  }

  addNode(nodeName: string) {
    this.nodes.update(nodes => {
      if(nodes.some(node => node.id === nodeName)) {
        return nodes
      }
      const newNodes = [...nodes, {
        id: nodeName,
        data: {
          label: nodeName
        },
        position: {
          x: 0,
          y: 0
        },
        connectable: false,
        deletable: true,
      }]

      this.simulation.nodes(newNodes)
      this.simulation.alpha(1).restart()

      return newNodes
    })
  }

  removeNode(nodeName: string) {
    this.nodes.update(nodes => {
      return nodes.filter(node => node.id !== nodeName)
    })
    this.edges.update(edges => {
      return edges.filter(edge => edge.source !== nodeName && edge.target !== nodeName)
    })
  }

  addLink(source: string, target: string, weight: number) {
    const currentNodes = get(this.nodes)
    if (currentNodes.find(n => n.id === source) && currentNodes.find(n => n.id === target)) {
      this.edges.update(edges => {
        if(edges.some(edge => edge.source === source && edge.target === target)) {
          return edges
        }
        return [...edges, {
          id: `${source}-${target}`,
          source,
          target,
          label: get(this.isValueWeighted) ? weight.toString(): undefined,
          markerEnd: get(this.isDirectional) ? {
            type: MarkerType.ArrowClosed,
          } : undefined,
        }]
      })
    }
  }
  
  removeLink(source: string, target: string) {
    this.edges.update(edges => {
      return edges.filter(edge => edge.source !== source || edge.target !== target)
    })
  }

  toggleDirectional(value: boolean) {
    this.isDirectional.update((directional) => {
      return value
    })
    this.edges.update(edges => {
      return edges.map(edge => {
        return {
          ...edge,
          markerEnd: get(this.isDirectional) ? {
            type: MarkerType.Arrow,
          } : undefined,
        }
      })
    })
  }

  toggleValueWeighted(value: boolean) {
    this.isValueWeighted.update(() => {
      return value
    })

    this.clearGraph()
  }

  getAdjacentVertices = (nodeId: string) => {
    const incoming = get(this.edges).filter(edge => edge.target === nodeId).map(edge => edge.source)
    const outgoing = get(this.edges).filter(edge => edge.source === nodeId).map(edge => edge.target)

    return {
      incoming: get(this.isDirectional) ? incoming : [...incoming, ...outgoing],
      outgoing: get(this.isDirectional) ? outgoing : [...incoming, ...outgoing],
    }
  }

  getVertexDegree = (nodeId: string) => {
    const incomingDegree = get(this.edges).filter(edge => edge.target === nodeId).length
    const outgoingDegree = get(this.edges).filter(edge => edge.source === nodeId).length

    return {
      incoming: incomingDegree,
      outgoing: outgoingDegree,
      total: get(this.isDirectional) ? incomingDegree + outgoingDegree : outgoingDegree,
    }
  }

  areVerticesAdjacent = (vertexA: string, vertexB: string) => {
    const edges = get(this.edges)
    const isDirectional = get(this.isDirectional)

    const nodes = get(this.nodes)
    if (!nodes.find(node => node.id === vertexA) || !nodes.find(node => node.id === vertexB)) {
      return false
    }

    const directConnection = edges.find(edge => edge.source === vertexA && edge.target === vertexB)

    const reverseConnection = edges.some(edge =>
      edge.source === vertexB && edge.target === vertexA
    )

    return isDirectional ? directConnection: (directConnection || reverseConnection)

  }

  findShortestPath = (start: string, end: string) => {
    const distances: Record<string, number> = {}
    const previous: Record<string, string | null> = {}
    const unvisited = new Set(get(this.nodes).map(node => node.id))

    get(this.nodes).forEach(node => {
      distances[node.id] = Infinity
      previous[node.id] = null
    })
    distances[start] = 0

    while (unvisited.size > 0) {
      let currentNode = null
      let minDistance = Infinity

      for (const node of unvisited) {
        if (distances[node] < minDistance) {
          currentNode = node
          minDistance = distances[node]
        }
      }

      if (currentNode === null || currentNode === end) break;

      unvisited.delete(currentNode)

      const edges = get(this.edges)

      edges.forEach(edge => {
        if (edge.source === currentNode || (!get(this.isDirectional) && edge.target === currentNode)) {
          const neighbor = edge.source === currentNode ? edge.target : edge.source
          if (unvisited.has(neighbor)) {
            const weight = parseInt(edge.label || '0')
            const newDistance = distances[currentNode] + weight
            if (newDistance < distances[neighbor]) {
              distances[neighbor] = newDistance
              previous[neighbor] = currentNode
            }
          }
        }
      })
    }

    const path: string[] = []
    let current = end
    while (current && previous[current]) {
      path.unshift(current)
      current = previous[current] || ''
    }

    if (current === start) {
      path.unshift(start)
      return {
        cost: distances[end],
        path
      }
    }

    return {
      cost: Infinity,
      path: []
    }
  }

  checkEulerian(): boolean {
    const nodes = get(this.nodes)
    const edges = get(this.edges)
    const isDirectional = get(this.isDirectional)

    if (isDirectional) {
      const degrees = new Map<string, { in: number, out: number }>();

      nodes.forEach(node => {
        degrees.set(node.id, { in: 0, out: 0 });
      });

      edges.forEach(edge => {
        const source = degrees.get(edge.source);
        const target = degrees.get(edge.target);

        if (source) source.out++;
        if (target) target.in++;
      })

      return Array.from(degrees.values()).every(({ in: inDegree, out: outDegree }) => inDegree === outDegree);
    } else {
      const degrees = new Map<string, number>();

      nodes.forEach(node => {
        degrees.set(node.id, 0);
      });

      edges.forEach(edge => {
        const source = degrees.get(edge.source);
        const target = degrees.get(edge.target);

        if (source !== undefined) degrees.set(edge.source, source + 1);
        if (target !== undefined) degrees.set(edge.target, target + 1);
      })

      return Array.from(degrees.values()).every(degree => degree % 2 === 0);
    }
  }
}

const GRAPH_KEY = Symbol("graph")

export function setGraph() {
  return setContext(GRAPH_KEY, new Graph())
}

export function getGraph() {
  return getContext<ReturnType<typeof setGraph>>(GRAPH_KEY)
}