import type { ImageSourcePropType } from 'react-native';
const equipment: Record<string, ImageSourcePropType> = {
  barbell: require('../../../assets/images/equipment/barbell.png'),
  cable: require('../../../assets/images/equipment/cable.png'),
  cardio_machine: require('../../../assets/images/equipment/cardio_machine.png'),
  dip_station: require('../../../assets/images/equipment/dip_station.png'),
  dumbbell: require('../../../assets/images/equipment/dumbbell.png'),
  ez_bar: require('../../../assets/images/equipment/ez_bar.png'),
  kettlebell: require('../../../assets/images/equipment/kettlebell.png'),
  landmine: require('../../../assets/images/equipment/landmine.png'),
  machine: require('../../../assets/images/equipment/machine.png'),
  other: require('../../../assets/images/equipment/other.png'),
  plate: require('../../../assets/images/equipment/plate.png'),
  pull_up_bar: require('../../../assets/images/equipment/pull_up_bar.png'),
  resistance_band: require('../../../assets/images/equipment/resistance_band.png'),
  smith_machine: require('../../../assets/images/equipment/smith_machine.png'),
  trap_bar: require('../../../assets/images/equipment/trap_bar.png'),
};
export const equipmentImage = (id: string | null) => equipment[id || 'other'] || equipment.other;
