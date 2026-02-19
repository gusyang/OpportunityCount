export interface Rule {
  id: string
  name: string
  status: "active" | "disabled"
  customers: string[]
  taskTypes: string[]
  locationTypes: string[]
  itemGroups: string[]
  triggers: {
    zeroStock: boolean
    lowStock: boolean
    lowStockThreshold: number
    exception: boolean
    exceptionTypes: string[]
  }
  execution: {
    countMethod: "smart" | "confirm_empty" | "blind"
    defaultAssignee: string
    instantCount: boolean
    allowSkip: boolean
    preventDuplicates: boolean
  }
  priority: number
}

export const CUSTOMERS = ["All Customers", "Shark", "Vizio", "Orgain", "Vita coco"]
export const TASK_TYPES = ["Pick", "Putaway", "Movement", "Replenishment", "Consolidation"]
export const LOCATION_TYPES = ["Location", "Pick", "Staging", "Dock"]
export const ITEM_GROUPS = ["Class A", "Class B", "Class C", "Fragile", "Hazmat"]
export const EXCEPTION_TYPES = ["Not Found", "Inventory Issue", "Quantity Mismatch"]
export const ASSIGNEES = ["Unassigned", "Admin", "Warehouse Lead", "Shift Supervisor"]

export const SAMPLE_RULES: Rule[] = [
  {
    id: "1",
    name: "High-Value Zero Stock Review",
    status: "active",
    customers: ["Amazon", "Nike"],
    taskTypes: ["Pick", "Putaway"],
    locationTypes: ["Storage", "Pick"],
    itemGroups: ["High Value", "Class A"],
    triggers: {
      zeroStock: true,
      lowStock: false,
      lowStockThreshold: 0,
      exception: true,
      exceptionTypes: ["Not Found", "Quantity Mismatch"],
    },
    execution: {
      countMethod: "blind",
      defaultAssignee: "Warehouse Lead",
      instantCount: true,
      allowSkip: false,
      preventDuplicates: true,
    },
    priority: 1,
  },
  {
    id: "2",
    name: "General Low Stock Alert",
    status: "active",
    customers: ["All Customers"],
    taskTypes: ["Pick"],
    locationTypes: ["Pick"],
    itemGroups: ["Class A", "Class B"],
    triggers: {
      zeroStock: false,
      lowStock: true,
      lowStockThreshold: 5,
      exception: false,
      exceptionTypes: [],
    },
    execution: {
      countMethod: "smart",
      defaultAssignee: "Unassigned",
      instantCount: false,
      allowSkip: true,
      preventDuplicates: true,
    },
    priority: 2,
  },
  {
    id: "3",
    name: "Exception-Based Recount",
    status: "disabled",
    customers: ["Walmart", "Target"],
    taskTypes: ["Pick", "Movement"],
    locationTypes: ["Storage", "Staging"],
    itemGroups: ["Fragile", "Hazmat"],
    triggers: {
      zeroStock: false,
      lowStock: false,
      lowStockThreshold: 0,
      exception: true,
      exceptionTypes: ["Not Found", "Empty Location", "Damaged"],
    },
    execution: {
      countMethod: "confirm_empty",
      defaultAssignee: "Admin",
      instantCount: false,
      allowSkip: false,
      preventDuplicates: true,
    },
    priority: 3,
  },
]
