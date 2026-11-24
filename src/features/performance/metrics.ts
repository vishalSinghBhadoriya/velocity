import type { Vehicle } from '../../data/vehicles'
export const powerToWeight = (vehicle: Vehicle) => Math.round(vehicle.hp / vehicle.weight * 1000)
export const accelerationAt = (vehicle: Vehicle, seconds: number) => Math.round(100 * Math.max(0,Math.min(seconds/vehicle.zero,1)))
