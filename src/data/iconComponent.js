import { defineAsyncComponent } from 'vue'

const Document = defineAsyncComponent(() => import('@element-plus/icons-vue').then(module => module.Document))
const IconMenu = defineAsyncComponent(() => import('@element-plus/icons-vue').then(module => module.IconMenu))
const Location = defineAsyncComponent(() => import('@element-plus/icons-vue').then(module => module.Location))
const School = defineAsyncComponent(() => import('@element-plus/icons-vue').then(module => module.School))
const House = defineAsyncComponent(() => import('@element-plus/icons-vue').then(module => module.House))
const DataLine = defineAsyncComponent(() => import('@element-plus/icons-vue').then(module => module.DataLine))
const Suitcase = defineAsyncComponent(() => import('@element-plus/icons-vue').then(module => module.Suitcase))
const Money = defineAsyncComponent(() => import('@element-plus/icons-vue').then(module => module.Money))
const CirclePlus = defineAsyncComponent(() => import('@element-plus/icons-vue').then(module => module.CirclePlus))
const CollectionTag = defineAsyncComponent(() => import('@element-plus/icons-vue').then(module => module.CollectionTag))
const Discount = defineAsyncComponent(() => import('@element-plus/icons-vue').then(module => module.Discount))

export const getIconComponent = iconName => {
  switch (iconName) {
    case 'Document':
      return Document
    case 'IconMenu':
      return IconMenu
    case 'Location':
      return Location
    case 'School':
      return School
    case 'House':
      return House
    case 'DataLine':
      return DataLine
    case 'Suitcase':
      return Suitcase
    case 'Money':
      return Money
    case 'CirclePlus':
      return CirclePlus
    case 'CollectionTag':
      return CollectionTag
    case 'Discount':
      return Discount
    default:
      return null
  }
}
