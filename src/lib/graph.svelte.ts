import { MarkerType, type Edge, type Node } from "@xyflow/svelte";
import { getContext, setContext } from "svelte";
import { writable, derived, get } from "svelte/store";

export class Graph {
  nodes = writable<Node[]>([])
  edges = writable<Edge[]>([])
  isDirectional = writable<boolean>(false)

  clearGraph() {
    this.nodes.set([])
    this.edges.set([])
  }

  addNode(nodeName: string) {
    this.nodes.update(nodes => {
      if(nodes.some(node => node.id === nodeName)) {
        return nodes
      }
      return [...nodes, {
        id: nodeName,
        data: {
          label: nodeName
        },
        position: {
          x: Math.random() * 500,
          y: Math.random() * 500
        },
        connectable: false,
        deletable: true,
      }]
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
          label: weight.toString(),
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
    return get(this.edges).some(edge => 
      (edge.source === vertexA && edge.target === vertexB) ||
      (!get(this.isDirectional) && edge.source === vertexB && edge.target === vertexA)
    )
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
      const currentNode = Array.from(unvisited).reduce((minNode, node) => 
        distances[node] < distances[minNode] ? node : minNode
      )

      if (currentNode === end) {
        break
      }

      unvisited.delete(currentNode)

      get(this.edges).forEach(edge => {
        if (edge.source === currentNode && unvisited.has(edge.target)) {
          const newDistance = distances[currentNode] + parseInt(edge.label!)
          if (newDistance < distances[edge.target]) {
            distances[edge.target] = newDistance
            previous[edge.target] = currentNode
          }

          if(!get(this.isDirectional) && edge.target === currentNode && unvisited.has(edge.source)) {
            const newDistance = distances[currentNode] + parseInt(edge.label!)
            if (newDistance < distances[edge.source]) {
              distances[edge.source] = newDistance
              previous[edge.source] = currentNode
            }
          }
        }
      })
    }

    const path: string[] = []
    let current = end
    while (current) {
      path.unshift(current)
      current = previous[current] || ''
    }

    if (path[0] !== start) {
      return {
        cost: Infinity,
        path: []
      }
    }

    return {
      cost: distances[end],
      path
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