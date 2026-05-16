'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { List, X } from '@phosphor-icons/react'
import Link from 'next/link'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { useLocale } from '@/i18n/LocaleProvider'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { NotificationBell } from '@/components/ui/NotificationBell'
import { UserAvatar } from '@/components/ui/UserAvatar'
import { cn } from '@/lib/utils/cn'
import { WalletBalanceChip } from '@/components/ui/WalletBalanceChip'
import { mockBalances } from '@/lib/mock'
import { useUIStore } from '@/lib/store/useUIStore'
import { getUnreadCount } from '@/lib/mock/notifications.mock'
import { NotificationPanel } from '@/components/ui/NotificationPanel'

export default function Header({ 
  title, 
  onMenuClick, 
  isMenuOpen = false, 
  showCloseIcon = false,
  desktopSidebarWidth = 0,
}: { 
  title?: React.ReactNode; 
  onMenuClick?: () => void; 
  isMenuOpen?: boolean; 
  showCloseIcon?: boolean;
  desktopSidebarWidth?: number;
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { locale: currentLocale, t } = useLocale()
  const { toggleNotificationPanel, unreadNotificationCount, isNotificationPanelOpen, setUnreadNotificationCount, setNotificationPanelOpen } = useUIStore()

  // Logic to determine role and balance for display
  const isOwner = pathname.includes('/owner')
  const isVisitor = pathname.includes('/visitor')
  const isCarrier = pathname.includes('/carrier')
  const isGov = pathname.includes('/gov')

  const balance = isOwner ? mockBalances['user-owner-1'] :
                  isVisitor ? mockBalances['user-visitor-1'] :
                  isCarrier ? mockBalances['user-carrier-1'] : 0

  const shouldShowBalance = isVisitor || isOwner

  // Determine role for navigation and notifications
  const rolePath = isOwner ? 'owner' :
                   isVisitor ? 'visitor' :
                   isCarrier ? 'carrier' :
                   isGov ? 'gov' : 'visitor'

  // Determine uppercase role for notifications
  const userRole = isOwner ? 'Owner' :
                   isVisitor ? 'Visitor' :
                   isCarrier ? 'Carrier' :
                   isGov ? 'Gov' : 'Visitor'

  // Set initial unread notification count based on role
  useEffect(() => {
    const count = getUnreadCount(userRole)
    setUnreadNotificationCount(count)
  }, [userRole, setUnreadNotificationCount])

  // Ref for bell anchor element (used for panel positioning)
  const bellRef = useRef<HTMLDivElement>(null)

  return (
    <>
       <header
         className={cn(
           'sticky top-0 z-[var(--z-header)] w-full border-b-4 border-[color:var(--color-primary)]',
           'bg-white shadow-[var(--shadow-navbar)] transition-all duration-fast'
         )}
         style={{ height: 'var(--navbar-height)' }}
       >
          {/* Main Header Container */}
          <div
            className="h-full flex items-center justify-between px-[var(--space-4)] md:px-[var(--space-5)] lg:px-[var(--space-6)] transition-[padding] duration-300 ease-in-out"
            style={{ paddingLeft: desktopSidebarWidth ? `calc(${desktopSidebarWidth}px + var(--space-5))` : undefined }}
          >
            
            {/* Section: Page Identity & Navigation Controls */}
            <div className="flex items-center gap-[var(--space-3)]">
              
              {/* Platform Logo - Anchors the sidebar column in RTL */}
              <Link href={`/${currentLocale}/${rolePath}/home`} className="header-logo-link" aria-label="Go to home">
                <Image
                  src="/brand/logo-clean.svg"
                  alt="TNA Logo"
                  width={44}
                  height={44}
                  className="drop-shadow-sm"
                  priority
                />
                <svg viewBox="0 0 155 153" width="36" height="36" className="hidden">
                  <path fill="#29BBE3" d="M91.923096,74.412758 C92.011192,72.330902 92.483940,70.536263 92.014168,69.036934 C89.763351,61.853386 94.730690,58.297337 99.266914,54.810966 C100.399475,53.940525 103.616158,54.160423 104.732498,55.157841 C111.163475,60.903744 117.251717,67.033287 123.453949,73.035034 C123.692322,73.265709 123.985786,73.481956 124.123810,73.767632 C127.273087,80.285728 123.066048,85.552170 120.941574,91.064507 C119.538445,94.705208 117.849060,98.223228 112.516518,97.975098 C103.732346,97.566376 94.910515,98.018417 86.115845,97.744713 C84.165695,97.684021 81.143486,96.562157 80.573593,95.142593 C79.430595,92.295456 79.473679,88.874702 82.955864,86.886391 C87.688324,84.184158 90.568054,80.086647 91.923096,74.412758 z"/>
                  <path fill="#1ACDE4" d="M62.764862,52.310562 C57.106541,46.887779 51.812820,41.602070 46.300247,36.555412 C43.127430,33.650761 43.118984,31.410664 46.860374,29.203804 C48.715927,28.109304 50.469967,26.840391 52.339897,25.772957 C65.447098,18.290842 67.755020,18.608322 78.192497,28.973970 C82.790497,33.540325 87.405487,38.094681 92.152794,42.503719 C95.114746,45.254627 95.121445,47.540482 92.253738,50.459183 C88.642815,54.134319 85.519180,57.620945 79.507713,54.589443 C77.478653,53.566208 74.149223,54.134613 71.782951,54.992737 C68.005592,56.362595 65.378578,55.418049 62.764862,52.310562 z"/>
                  <path fill="#05B6C9" d="M53.812630,88.804802 C49.919830,92.697464 46.201691,96.267418 42.663074,100.007240 C40.478100,102.316444 38.520840,102.161011 37.086452,99.587265 C34.200867,94.409637 31.341187,89.182785 29.050133,83.732712 C28.466656,82.344696 29.516230,79.534630 30.734346,78.247643 C37.241837,71.372238 43.925907,64.649834 50.839985,58.185860 C52.149925,56.961197 55.682724,56.090816 56.601437,56.887859 C58.577667,58.602379 61.084007,61.915615 60.581387,63.848450 C59.262985,68.918427 59.222393,73.509514 60.838623,78.436424 C61.266262,79.740028 60.226753,81.883446 59.260983,83.201744 C57.805347,85.188698 55.822075,86.789108 53.812630,88.804802 z"/>
                  <path fill="#21CEE5" d="M60.886765,124.117050 C56.632568,119.862686 52.673595,115.812714 48.607647,111.873169 C46.303150,109.640312 45.745804,107.664841 48.343029,105.161255 C53.737492,99.961258 58.844574,94.456604 64.360931,89.394447 C65.644943,88.216148 68.351357,87.533165 69.925804,88.057121 C71.203674,88.482376 72.498001,91.044296 72.528412,92.681938 C72.747879,104.501801 72.695496,116.328072 72.578964,128.150833 C72.566307,129.434692 71.848305,131.521332 71.007416,131.781616 C69.963837,132.104630 68.221497,131.185715 67.189011,130.317825 C65.030029,128.503036 63.138550,126.369995 60.886765,124.117050 z"/>
                  <path fill="#07B6C9" d="M113.292229,53.711456 C104.340279,45.018501 95.565315,36.648888 87.009445,28.061005 C85.572197,26.618378 85.082863,24.231365 84.155533,22.280712 C86.407066,21.821665 88.850067,20.554718 90.878876,21.035511 C103.453743,24.015547 111.853821,32.631142 118.681679,42.945854 C123.382088,50.046673 125.280296,56.899139 124.588257,62.466858 C119.259819,61.621449 117.350594,56.459103 113.292229,53.711456 z"/>
                  <path fill="#0964AC" d="M89.411804,126.438492 C86.569756,128.449387 83.979797,130.207108 81.389839,131.964813 C80.977890,128.953690 80.355156,125.953003 80.205322,122.928886 C80.000519,118.795502 80.196053,114.643753 80.142586,110.500885 C80.104218,107.527786 81.165733,105.779175 84.450050,105.814690 C90.747528,105.882790 97.047905,105.760628 103.342995,105.900734 C104.471298,105.925842 105.579956,106.833420 106.697685,107.333542 C106.174927,108.459267 105.903961,109.828926 105.088295,110.670891 C100.014709,115.908119 94.819069,121.027100 89.411804,126.438492 z"/>
                  <path fill="#0964AC" d="M40.431114,57.419350 C37.357357,60.489933 34.603542,63.383530 31.670990,66.082962 C30.802212,66.882683 29.430035,67.135529 28.288534,67.638977 C27.855976,66.489624 26.975681,65.305389 27.062094,64.196480 C27.720072,55.752609 30.567160,48.034725 35.341675,41.050243 C35.864090,40.286018 37.337875,39.178097 37.502090,39.310062 C40.681549,41.865173 44.061527,44.314453 46.590508,47.440578 C47.276215,48.288193 45.565163,51.433933 44.482418,53.242447 C43.571514,54.763935 41.975464,55.875237 40.431114,57.419350 z"/>
                  <path fill="#175999" d="M85.150543,80.150787 C80.246162,84.440826 75.130402,85.302643 69.746681,82.202332 C65.146362,79.553146 63.183407,75.347740 63.726444,70.048790 C64.275879,64.687416 67.284599,61.224682 72.273567,59.495682 C77.241882,57.773842 82.876404,59.605442 86.086525,63.813396 C89.673294,68.515068 89.437546,74.068520 85.150543,80.150787 M66.883354,70.697517 C66.646461,74.963707 68.374115,78.607033 72.352341,79.679169 C75.162277,80.436455 78.915413,79.973373 81.527359,78.642181 C85.278999,76.730156 86.068161,72.667709 84.877518,68.680016 C83.670242,64.636566 80.623543,62.219543 76.458893,62.172791 C71.413315,62.116150 68.131859,64.859581 66.883354,70.697517 z"/>
                  <path fill="#E8EEF5" d="M66.923996,70.294647 C68.131859,64.859581 71.413315,62.116150 76.458893,62.172791 C80.623543,62.219543 83.670242,64.636566 84.877518,68.680016 C86.068161,72.667709 85.278999,76.730156 81.527359,78.642181 C78.915413,79.973373 75.162277,80.436455 72.352341,79.679169 C68.374115,78.607033 66.646461,74.963707 66.923996,70.294647 M73.432686,77.192612 C77.615112,78.713234 80.712975,77.447983 82.064270,73.232719 C83.078545,70.068794 81.993004,67.252144 78.866180,65.728905 C75.775620,64.223320 72.853500,64.916504 70.992828,67.750664 C68.772057,71.133331 69.366699,74.342918 73.432686,77.192612 z"/>
                  <path fill="#094F93" d="M73.077316,77.020508 C69.366699,74.342918 68.772057,71.133331 70.992828,67.750664 C72.853500,64.916504 75.775620,64.223320 78.866180,65.728905 C81.993004,67.252144 83.078545,70.068794 82.064270,73.232719 C80.712975,77.447983 77.615112,78.713234 73.077316,77.020508 z"/>
                </svg>
              </Link>

              {/* Hamburger Button — Primary toggle for sidebar */}
              {onMenuClick && (
                <button
                  className="p-2 -mx-2 text-text-secondary hover:bg-neutral-50 rounded-md transition-colors"
                  onClick={onMenuClick}
                  aria-label={showCloseIcon ? t('common.close_menu') : t('common.menu')}
                  aria-expanded={isMenuOpen}
                >
                  {showCloseIcon ? (
                    <X size={22} weight="bold" className="transition-transform duration-200 ease" />
                  ) : (
                    <List size={22} weight="bold" className="transition-transform duration-200 ease" />
                  )}
                </button>
              )}

              {/* Page Title - Visible on all screens */}
              {title && (
                <div className="mx-2 min-w-0">
                  <h1 className="text-sm font-semibold text-[#1a2736] whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-none">
                    {title}
                  </h1>
                </div>
              )}
            </div>

            {/* Section: User Account & System Controls */}
            <div className="flex items-center gap-[var(--space-3)]">
              
              {/* Wallet Status Chip */}
              {shouldShowBalance && (
                <div className="hidden sm:block">
                   <WalletBalanceChip
                     balance={balance}
                     onClick={() => router.push(`/${currentLocale}/visitor/wallet`)}
                   />
                </div>
              )}

              {/* Language Selection */}
              <LanguageSwitcher variant="ghost" />

              {/* Notification Center */}
              <div className="notif-wrapper" ref={bellRef}>
                <NotificationBell
                  count={unreadNotificationCount}
                  isOpen={isNotificationPanelOpen}
                  onClick={toggleNotificationPanel}
                />
              </div>

              {/* Profile / Avatar */}
              <UserAvatar
                isVisitor={isVisitor}
                user={{
                  name: isOwner ? 'أحمد المالك' :
                        isCarrier ? 'ناقل المثال' :
                        isGov ? 'جهة حكومية' : undefined,
                  avatar: undefined
                }}
                onClick={() => {
                  router.push(`/${currentLocale}/${rolePath}/profile`)
                }}
              />
            </div>
          </div>
        </header>

      {/* Notification panel portal (rendered at body level) */}
      {isNotificationPanelOpen && createPortal(
        <NotificationPanel
          isOpen={isNotificationPanelOpen}
          anchorRef={bellRef}
          onClose={() => setNotificationPanelOpen(false)}
        />,
        document.body
      )}
    </>
  )
}
