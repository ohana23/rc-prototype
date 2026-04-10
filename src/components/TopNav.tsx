import { Avatar } from "@procore/core-react";

const svgDataUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const iconMenu = svgDataUri(`
<svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 0H18V2H0V0Z" fill="white"/>
<path d="M0 6H18V8H0V6Z" fill="white"/>
<path d="M0 12H18V14H0V12Z" fill="white"/>
</svg>
`);
const logoWordmark = svgDataUri(`
<svg width="106" height="14" viewBox="0 0 106 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M92.8322 0.00392274H106V2.60833H96.3279V5.69657H102.553V8.30098H96.3279V11.3892H106V14.0039H92.8322V0.00392274ZM44.5308 2.88627V11.1216C44.5431 11.4995 44.4812 11.8761 44.3489 12.2279C44.2165 12.5797 44.0166 12.8992 43.7616 13.1666C43.5065 13.434 43.2017 13.6436 42.8661 13.7823C42.5306 13.921 42.1714 13.986 41.8108 13.973H33.2091C32.8449 13.9917 32.481 13.9311 32.1402 13.7951C31.7995 13.6591 31.4893 13.4506 31.2292 13.1827C30.9691 12.9149 30.7647 12.5935 30.6289 12.2387C30.493 11.884 30.4287 11.5036 30.44 11.1216V2.88627C30.4291 2.50783 30.4923 2.13105 30.6257 1.77922C30.7591 1.42739 30.96 1.10798 31.2158 0.840742C31.4717 0.5735 31.7771 0.364099 32.1131 0.225478C32.4492 0.0868575 32.8089 0.0219622 33.1698 0.0348038H41.7716C42.1353 0.0160532 42.4988 0.0766552 42.839 0.212773C43.1793 0.34889 43.4889 0.55756 43.7482 0.825582C44.0076 1.0936 44.2111 1.41514 44.3458 1.76985C44.4805 2.12456 44.5435 2.50472 44.5308 2.88627ZM42.3705 7.00392L39.9353 2.60833H35.0257L32.6494 7.00392L35.0748 11.3995H39.9844L42.3705 7.00392ZM88.8456 8.86716L91.6834 14.0039H87.9127L85.0848 8.86716H80.9999V14.0039H77.5042V0.00392274H88.5903C88.9542 -0.0107183 89.317 0.0539804 89.6558 0.193925C89.9947 0.333871 90.3021 0.546014 90.5587 0.816937C90.8153 1.08786 91.0154 1.41166 91.1465 1.76786C91.2775 2.12406 91.3366 2.50489 91.3201 2.88627V6.05686C91.3364 6.77044 91.0873 7.46271 90.6255 7.9872C90.1637 8.51169 89.5254 8.82726 88.8456 8.86716ZM87.8637 3.47304C87.8611 3.24453 87.7734 3.02614 87.6192 2.86456C87.4651 2.70297 87.2568 2.61101 87.0388 2.60833H81.049V6.27304H87.0388C87.2568 6.27037 87.4651 6.17841 87.6192 6.01682C87.7734 5.85523 87.8611 5.63684 87.8637 5.40833V3.47304ZM75.8938 2.88627V11.1216C75.9048 11.5 75.8416 11.8768 75.7082 12.2286C75.5747 12.5805 75.3739 12.8999 75.118 13.1671C74.8622 13.4343 74.5568 13.6437 74.2207 13.7824C73.8846 13.921 73.525 13.9859 73.1641 13.973H64.5623C64.2034 13.9831 63.8464 13.916 63.5131 13.776C63.1799 13.636 62.8775 13.426 62.6245 13.1589C62.3716 12.8918 62.1734 12.5733 62.0423 12.2229C61.9112 11.8725 61.8498 11.4977 61.862 11.1216V2.88627C61.8497 2.50833 61.9116 2.13176 62.0439 1.77996C62.1762 1.42816 62.3761 1.10864 62.6312 0.841235C62.8863 0.573831 63.1911 0.364258 63.5266 0.225531C63.8622 0.0868038 64.2214 0.0218835 64.5819 0.0348038H73.1837C73.543 0.0248272 73.9005 0.0918414 74.2343 0.231743C74.568 0.371645 74.8711 0.581491 75.1248 0.848433C75.3785 1.11537 75.5775 1.43379 75.7098 1.7842C75.842 2.1346 75.9047 2.50961 75.8938 2.88627ZM73.7238 7.00392L71.2984 2.60833H66.3887L64.0026 7.00392L66.4378 11.3995H71.3475L73.7238 7.00392ZM57.5415 0.00392274H48.9397C48.5762 -0.00916337 48.214 0.0565998 47.8759 0.197093C47.5377 0.337585 47.2309 0.549779 46.9746 0.820377C46.7183 1.09098 46.5181 1.41415 46.3865 1.76964C46.255 2.12513 46.1948 2.50528 46.2099 2.88627V11.1216C46.199 11.5 46.2622 11.8768 46.3956 12.2286C46.529 12.5805 46.7299 12.8999 46.9857 13.1671C47.2416 13.4343 47.547 13.6437 47.883 13.7824C48.2191 13.921 48.5787 13.9859 48.9397 13.973H57.5415C57.902 13.986 58.2612 13.921 58.5967 13.7823C58.9323 13.6436 59.2371 13.434 59.4922 13.1666C59.7473 12.8992 59.9472 12.5797 60.0795 12.2279C60.2118 11.8761 60.2737 11.4995 60.2614 11.1216V8.87745H57.0603L55.666 11.3995H50.7563L48.38 7.00392L50.8054 2.60833H55.7151L57.1094 5.13039H60.3105V2.88627C60.3275 2.50127 60.2673 2.11681 60.1339 1.75766C60.0005 1.39852 59.7968 1.07267 59.5359 0.80111C59.275 0.529551 58.9628 0.318311 58.6192 0.181006C58.2757 0.0437007 57.9086 -0.0166224 57.5415 0.00392274ZM26.5123 8.86716L29.3501 14.0039H25.6089L22.7711 8.86716H18.6568V14.0039H15.2004V0.00392274H26.2766C26.6401 -0.00916337 27.0023 0.0565998 27.3405 0.197093C27.6786 0.337585 27.9854 0.549779 28.2417 0.820377C28.498 1.09098 28.6982 1.41415 28.8298 1.76964C28.9613 2.12513 29.0215 2.50528 29.0064 2.88627V6.05686C29.0226 6.77382 28.7708 7.46902 28.3048 7.99407C27.8388 8.51912 27.1956 8.83244 26.5123 8.86716ZM25.5303 3.47304C25.5278 3.24276 25.4387 3.02284 25.2824 2.86097C25.1262 2.69909 24.9154 2.60832 24.6957 2.60833H18.6568V6.27304H24.6368C24.8564 6.27306 25.0673 6.18228 25.2235 6.02041C25.3798 5.85853 25.4688 5.63861 25.4714 5.40833L25.5303 3.47304ZM13.806 2.88627V6.05686C13.8183 6.43481 13.7564 6.81137 13.6241 7.16317C13.4918 7.51498 13.2919 7.8345 13.0368 8.1019C12.7817 8.36931 12.4769 8.57888 12.1413 8.71761C11.8058 8.85633 11.4466 8.92125 11.0861 8.90833H3.49569V14.0039H0V0.00392274H11.0861C11.4492 -0.00926017 11.8109 0.0565179 12.1486 0.197114C12.4862 0.33771 12.7924 0.550078 13.048 0.820844C13.3035 1.09161 13.5027 1.41491 13.6332 1.77038C13.7637 2.12585 13.8225 2.50579 13.806 2.88627ZM10.3103 3.50392C10.3077 3.27365 10.2187 3.05372 10.0624 2.89185C9.90617 2.72997 9.69535 2.6392 9.47568 2.63922H3.49569V6.30392H9.47568C9.69535 6.30394 9.90617 6.21316 10.0624 6.05129C10.2187 5.88942 10.3077 5.66949 10.3103 5.43922V3.50392Z" fill="white"/>
<path d="M51.9543 4.69824L50.6777 7.00412L51.9543 9.31001H54.5073L55.7838 7.00412L54.5073 4.69824H51.9543Z" fill="#FF5100"/>
</svg>
`);
const logoHex = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 30" fill="none"><path d="M13 1.4 24 7.7v14.6L13 28.6 2 22.3V7.7L13 1.4Z" fill="%23FF5100"/><path d="M8 10.2h10v9.6H8z" fill="%23FFFFFF" opacity=".22"/></svg>'
);
const projectImage = "/topnav/seattle-corridor.png";
const iconCaret = svgDataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 6" fill="none"><path d="m1 1 4 4 4-4" stroke="%23D6DADC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
);
const iconCopilot = svgDataUri(`
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.66958 8.66958C8.16641 9.17274 7.61532 9.61608 7.02137 10C5.08004 8.74515 2.68077 8.12501 0 8.12501C2.74905 8.12501 4.72819 7.30766 6.01792 6.01792C7.30766 4.72819 8.125 2.74905 8.125 0H11.875C11.875 3.50095 10.8173 6.52181 8.66958 8.66958Z" fill="#FF7433"/>
<path d="M11.3304 11.3304C11.8336 10.8273 12.3847 10.3839 12.9786 10C14.92 11.2549 17.3192 11.875 20 11.875C17.251 11.875 15.2718 12.6924 13.9821 13.9821C12.6923 15.2718 11.875 17.251 11.875 20H8.125C8.125 16.4991 9.18265 13.4782 11.3304 11.3304Z" fill="#FF7433"/>
<path d="M11.3304 8.66957C10.8273 8.16641 10.3839 7.61533 10 7.02138C11.2549 5.08004 11.875 2.68077 11.875 0C11.875 2.74905 12.6923 4.72819 13.9821 6.01792C15.2718 7.30766 17.251 8.125 20 8.125V11.875C16.499 11.875 13.4782 10.8173 11.3304 8.66957Z" fill="#FF5100"/>
<path d="M8.66958 11.3304C6.52181 9.18267 3.50095 8.12501 0 8.12501V11.875C2.74905 11.875 4.72819 12.6924 6.01793 13.9821C7.30766 15.2718 8.125 17.251 8.125 20C8.125 17.3192 8.74514 14.92 10 12.9786C9.61608 12.3847 9.17274 11.8336 8.66958 11.3304Z" fill="#FF5100"/>
</svg>
`);
const iconHelp = svgDataUri(`
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12ZM10.5263 7.95937C10.2808 8.36033 10.1916 8.91994 10.1916 9.37657H7.5C7.5 8.66165 7.62111 7.4859 8.25879 6.44439C8.95769 5.30289 10.172 4.5 11.9579 4.5C13.5589 4.5 14.7796 4.98286 15.5728 5.91817C16.3382 6.82071 16.5 7.90665 16.5 8.67364C16.5 10.8341 15.0595 12.1455 13.8423 12.7536C13.5724 12.8885 13.381 13.0989 13.2617 13.2697V14.25H10.5701V13.1798C10.5701 12.8171 10.6368 12.3478 10.903 11.8984C11.162 11.4612 11.7165 10.699 12.681 10.2171C13.3984 9.85866 13.8084 9.32492 13.8084 8.67364C13.8084 8.26908 13.7179 7.97113 13.5581 7.78266C13.426 7.62697 13.0486 7.31172 11.9579 7.31172C11.0523 7.31172 10.7105 7.65841 10.5263 7.95937ZM11.954 19.5059C12.925 19.5059 13.7121 18.7187 13.7121 17.7477C13.7121 16.7767 12.925 15.9895 11.954 15.9895C10.9829 15.9895 10.1958 16.7767 10.1958 17.7477C10.1958 18.7187 10.9829 19.5059 11.954 19.5059Z" fill="white"/>
</svg>
`);
const iconComments = svgDataUri(`
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 18L22 22V6C22 5.44772 21.5523 5 21 5H19V14C19 14.55 18.55 15 18 15H6V17C6 17.5523 6.44771 18 7 18H18Z" fill="white"/>
<path d="M17 3C17 2.44772 16.5523 2 16 2H3C2.44772 2 2 2.44772 2 3V17L6 13H16C16.5523 13 17 12.5523 17 12V3Z" fill="white"/>
</svg>
`);
const iconBell = svgDataUri(`
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.5 15V10.5C18.5 7.19683 16.7174 4.73165 13.4999 4V2H10.4999V4C7.27119 4.73165 5.5 7.18607 5.5 10.5V15L3.5 17V18H20.5V17L18.5 15Z" fill="white"/>
<path d="M14.4999 19.5C14.4999 20.875 13.4142 22 11.9999 22C10.5728 22 9.49994 20.875 9.49994 19.5H14.4999Z" fill="white"/>
</svg>
`);
const companyLogo = "/topnav/company-logo.png";

export default function TopNav() {
  return (
    <header className="top-nav">
      <div className="top-nav__left">
        <div className="top-nav__logo-menu">
          <button className="top-nav__menu" aria-label="Menu">
            <img src={iconMenu} alt="" className="top-nav__menu-icon" />
            <span className="top-nav__menu-label">Menu</span>
          </button>
          <div className="top-nav__logo" aria-hidden="true">
            <img src={logoWordmark} alt="" className="top-nav__logo-wordmark" />
            <img src={logoHex} alt="" className="top-nav__logo-hex" />
          </div>
        </div>

        <button className="top-nav__project-picker" aria-label="Project selector">
          <img src={projectImage} alt="" className="top-nav__project-image" />
          <span className="top-nav__project-copy">
            <span className="top-nav__project-org">Vertigo Construction</span>
            <span className="top-nav__project-name">Utah Stadium</span>
          </span>
          <img src={iconCaret} alt="" className="top-nav__caret" />
        </button>
      </div>

      <button className="top-nav__search" aria-label="Search or ask a question">
        <span className="top-nav__search-field">
          <img src={iconCopilot} alt="" className="top-nav__search-icon" />
          <span className="top-nav__search-text">Search or Ask a Question</span>
        </span>
        <span className="top-nav__search-keys" aria-hidden="true">
          <kbd>Ctrl</kbd>
          <kbd>K</kbd>
        </span>
      </button>

      <div className="top-nav__right">
        <div className="top-nav__favorites">
          <svg
            className="top-nav__favorites-icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 2L14.75 9.36842H23L16.4 14.1053L19.15 22L12 17.2632L4.85 22L7.6 14.1053L1 9.36842H9.25L12 2Z"
              fill="white"
            />
          </svg>
          <span className="top-nav__favorites-copy">
            <span className="top-nav__favorites-label">Favorites</span>
            <a className="top-nav__favorites-link" href="/scheduling">
              Scheduling
            </a>
          </span>
        </div>
        <button className="top-nav__apps-picker" aria-label="App selector">
          <span className="top-nav__apps-copy">
            <span className="top-nav__apps-label">Apps</span>
            <span className="top-nav__apps-value">Select an App</span>
          </span>
          <img src={iconCaret} alt="" className="top-nav__caret" />
        </button>
        <button className="top-nav__icon-button top-nav__icon-help" aria-label="Help">
          <img src={iconHelp} alt="" className="top-nav__action-icon" />
        </button>
        <button className="top-nav__icon-button top-nav__icon-comments" aria-label="Comments">
          <img src={iconComments} alt="" className="top-nav__action-icon" />
        </button>
        <button className="top-nav__icon-button" aria-label="Notifications">
          <img src={iconBell} alt="" className="top-nav__action-icon" />
        </button>
        <div className="top-nav__profile-company">
          <button className="top-nav__avatar" aria-label="Profile">
            <Avatar size="lg">
              <Avatar.Portrait imageUrl="https://i.pravatar.cc/80?img=12" />
            </Avatar>
          </button>
          <button className="top-nav__company-logo" aria-label="Company logo">
            <img src={companyLogo} alt="Company logo" />
          </button>
        </div>
      </div>
    </header>
  );
}
