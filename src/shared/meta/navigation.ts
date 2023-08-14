import {
  IconBadgeCc,
  IconCalendarCheck,
  IconDeviceLaptopOff,
  IconHome,
  IconIdBadge2,
  SVGProps,
} from '@tabler/icons-vue'
import { FunctionalComponent } from 'vue'
import { Action, Resource } from '../interfaces/permissions'
import { IconSettings } from '@tabler/icons-vue'
import { IconIdBadge } from '@tabler/icons-vue'
import { IconShieldLock } from '@tabler/icons-vue'

interface NavigationItem {
  to: string
  name: PageName
  label: string
  icon: FunctionalComponent<SVGProps>
  requirePermissions?: string[]
  children?: NavigationItem[]
}

export enum PageName {
  // Authentication
  SignIn = 'signIn',
  SignUp = 'singUp',

  // Error pages
  Forbidden = 'forbidden',

  // Navigation
  Home = 'home',
  User = 'user',
  Attendance = 'attendance',
  Absence = 'absence',
  // Settings
  Setting = 'setting',
  SettingRole = 'role',
}

export const navigationItems: NavigationItem[] = [
  {
    to: '/',
    name: PageName.Home,
    label: 'home',
    icon: IconHome,
    requirePermissions: [],
  },
  {
    to: '/user',
    name: PageName.User,
    label: 'user',
    icon: IconIdBadge2,
    requirePermissions: [`${Resource.user}#${Action.read}`],
  },
  {
    to: '/attendance',
    name: PageName.Attendance,
    label: 'attendance',
    icon: IconCalendarCheck,
    requirePermissions: [`${Resource.attendance}#${Action.read_personal}`],
  },
  {
    to: '/absence',
    name: PageName.Absence,
    label: 'absence',
    icon: IconDeviceLaptopOff,
  },
  {
    to: '/setting',
    name: PageName.Setting,
    label: 'setting',
    icon: IconSettings,
    requirePermissions: [`${Resource.setting}#${Action.create}`, `${Resource.setting}#${Action.update}`],
    children: [
      {
        to: '/setting/user-title',
        name: PageName.SettingRole,
        label: 'role',
        icon: IconShieldLock,
      },
    ],
  },
]
