import React, { useEffect, useRef, useState } from "react";
import "./Sidenar.scss";

import { signal } from "@preact/signals-react";
import { Link, useNavigate } from "react-router-dom";
import { ruleInfor, userInfor } from "../../App";
import { useIntl } from "react-intl";
// import { isMobile } from "../Navigation/Navigation";

import {
  IoIosArrowForward,
  IoIosArrowDown,
  IoIosNotificationsOutline,
  IoMdMore,
} from "react-icons/io";
import { TbReportAnalytics } from "react-icons/tb";
import { SiDatabricks } from "react-icons/si";
import { RiSettingsLine } from "react-icons/ri";
import { VscDashboard } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { isBrowser, isMobile, useMobileOrientation } from "react-device-detect";
import { viewMode } from "../Home/Home";

export const sidenar = signal(true);
export const sidebartab = signal("Dashboard");
export const sidebartabli = signal("none");
const anamenu = signal(false);
const setmenu = signal(false);
const sys = signal([]);
export const showList = signal(false);
export const raiseInfo = signal(false);

export default function Sidenar(props) {
  const { isLandscape } = useMobileOrientation();
  const dataLang = useIntl();
  const lang = useSelector((state) => state.admin.lang);
  const navigate = useNavigate();
  const ana_icon = useRef();
  const ana_box = useRef();
  const set_icon = useRef();
  const set_box = useRef();
  const [preID, setPreID] = useState("");

  const data = {
    Dashboard: {
      icon: <VscDashboard />,
      iconmobile: <ion-icon name="earth-outline" />,
      iconmobilefull: <ion-icon name="earth" />,
      link: "/",
      li: sys.value,
    },

    // { link: "/Auto", name: dataLang.formatMessage({ id: "auto" }) },

    // { link: "/Elev", name: dataLang.formatMessage({ id: "elev" }) },
    // { link: "/Energy", name: dataLang.formatMessage({ id: "energy" }) }

    // Notif: { icon: <IoIosNotificationsOutline />, link: "/Notif", li: [] },
    Analytics: {
      icon: <TbReportAnalytics />,
      iconmobile: <ion-icon name="grid-outline" />,
      iconmobilefull: <ion-icon name="grid" />,
      link: "none",
      li: [
        {
          link: "/ExportEnergy",
          name: dataLang.formatMessage({ id: "export" }),
        },
        // { link: "/Report", name: dataLang.formatMessage({ id: "report" }) },
        { link: "/Warn", name: dataLang.formatMessage({ id: "warn" }) },
      ],
    },
    Setting: {
      icon: <RiSettingsLine />,
      iconmobile: <ion-icon name="settings-outline" />,
      iconmobilefull: <ion-icon name="settings" />,
      link: "none",
      li:
        userInfor.value.type === "master"
          ? [
              { link: "/Role", name: dataLang.formatMessage({ id: "role" }) },
              {
                link: "/GroupRole",
                name: dataLang.formatMessage({ id: "grouprole" }),
              },
              {
                link: "/User",
                name: dataLang.formatMessage({ id: "account" }),
              },
              {
                link: "/Contact",
                name: dataLang.formatMessage({ id: "contact" }),
              },
              {
                link: "/ErrorSetting",
                name: dataLang.formatMessage({ id: "errorsetting" }),
              },
              {
                link: "/RegisterSetting",
                name: dataLang.formatMessage({ id: "registersetting" }),
              },
              { link: "/Rule", name: dataLang.formatMessage({ id: "rule" }) },
            ]
          : userInfor.value.type === "mainadmin"
          ? [
              { link: "/Role", name: dataLang.formatMessage({ id: "role" }) },
              // { link: "/GroupRole", name: dataLang.formatMessage({ id: 'grouprole' }) },
              {
                link: "/User",
                name: dataLang.formatMessage({ id: "account" }),
              },
              {
                link: "/Contact",
                name: dataLang.formatMessage({ id: "contact" }),
              },
              {
                link: "/ErrorSetting",
                name: dataLang.formatMessage({ id: "errorsetting" }),
              },
              {
                link: "/RegisterSetting",
                name: dataLang.formatMessage({ id: "registersetting" }),
              },
              { link: "/Rule", name: dataLang.formatMessage({ id: "rule" }) },
            ]
          : userInfor.value.type === "admin"
          ? [
              { link: "/Role", name: dataLang.formatMessage({ id: "role" }) },
              // { link: "/GroupRole", name: dataLang.formatMessage({ id: 'grouprole' }) },
              {
                link: "/User",
                name: dataLang.formatMessage({ id: "account" }),
              },
              {
                link: "/Contact",
                name: dataLang.formatMessage({ id: "contact" }),
              },
              {
                link: "/ErrorSetting",
                name: dataLang.formatMessage({ id: "errorsetting" }),
              },
              {
                link: "/RegisterSetting",
                name: dataLang.formatMessage({ id: "registersetting" }),
              },
              { link: "/Rule", name: dataLang.formatMessage({ id: "rule" }) },
            ]
          : [
              // { link: "/GroupRole", name: dataLang.formatMessage({ id: 'grouprole' }) },
              {
                link: "/User",
                name: dataLang.formatMessage({ id: "account" }),
              },
              {
                link: "/Contact",
                name: dataLang.formatMessage({ id: "contact" }),
              },
            ],
    },
  };

  const data2 = {
    Dashboard: {
      icon: <VscDashboard />,
      iconmobile: <ion-icon name="earth-outline" />,
      iconmobilefull: <ion-icon name="earth" />,
      link: "/",
      li: sys.value,
    },
    // Notif: { icon: <IoIosNotificationsOutline />, link: "/Notif", li: [] },
    Analytics: {
      icon: <TbReportAnalytics />,
      iconmobile: <ion-icon name="grid-outline" />,
      iconmobilefull: <ion-icon name="grid" />,
      link: "none",
      li: [
        {
          link: "/ExportEnergy",
          name: dataLang.formatMessage({ id: "export" }),
        },
        // { link: "/Report", name: dataLang.formatMessage({ id: "report" }) },
        { link: "/Warn", name: dataLang.formatMessage({ id: "warn" }) },
      ],
    },
    Setting: {
      icon: <RiSettingsLine />,
      iconmobile: <ion-icon name="settings-outline" />,
      iconmobilefull: <ion-icon name="settings" />,
      link: "none",
      li:
        userInfor.value.type === "master"
          ? [
              { link: "/Role", name: dataLang.formatMessage({ id: "role" }) },
              {
                link: "/GroupRole",
                name: dataLang.formatMessage({ id: "grouprole" }),
              },
              {
                link: "/User",
                name: dataLang.formatMessage({ id: "account" }),
              },
              {
                link: "/Contact",
                name: dataLang.formatMessage({ id: "contact" }),
              },
              {
                link: "/ErrorSetting",
                name: dataLang.formatMessage({ id: "errorsetting" }),
              },
              {
                link: "/RegisterSetting",
                name: dataLang.formatMessage({ id: "registersetting" }),
              },
              { link: "/Rule", name: dataLang.formatMessage({ id: "rule" }) },
            ]
          : userInfor.value.type === "mainadmin"
          ? [
              { link: "/Role", name: dataLang.formatMessage({ id: "role" }) },
              // { link: "/GroupRole", name: dataLang.formatMessage({ id: 'grouprole' }) },
              {
                link: "/User",
                name: dataLang.formatMessage({ id: "account" }),
              },
              {
                link: "/Contact",
                name: dataLang.formatMessage({ id: "contact" }),
              },
              {
                link: "/ErrorSetting",
                name: dataLang.formatMessage({ id: "errorsetting" }),
              },
              {
                link: "/RegisterSetting",
                name: dataLang.formatMessage({ id: "registersetting" }),
              },
              { link: "/Rule", name: dataLang.formatMessage({ id: "rule" }) },
            ]
          : userInfor.value.type === "admin"
          ? [
              { link: "/Role", name: dataLang.formatMessage({ id: "role" }) },
              // { link: "/GroupRole", name: dataLang.formatMessage({ id: 'grouprole' }) },
              {
                link: "/User",
                name: dataLang.formatMessage({ id: "account" }),
              },
              {
                link: "/Contact",
                name: dataLang.formatMessage({ id: "contact" }),
              },
              {
                link: "/ErrorSetting",
                name: dataLang.formatMessage({ id: "errorsetting" }),
              },
              {
                link: "/RegisterSetting",
                name: dataLang.formatMessage({ id: "registersetting" }),
              },
              { link: "/Rule", name: dataLang.formatMessage({ id: "rule" }) },
            ]
          : [
              // { link: "/GroupRole", name: dataLang.formatMessage({ id: 'grouprole' }) },
              {
                link: "/User",
                name: dataLang.formatMessage({ id: "account" }),
              },
              {
                link: "/Contact",
                name: dataLang.formatMessage({ id: "contact" }),
              },
            ],
    },
  };

  const dataColor = {
    cur: { color: "rgba(11, 25, 103)", color2: "#0082CA", bg: "#144daf" }, //Dang chon
    pre: { color: "rgb(85, 85, 85)", color2: "rgb(85, 85, 85)", bg: "#072666" }, //Khong chon
  };

  const handleMenu = (e) => {
    const ID = e.currentTarget.id;
    console.log(ID);
    console.log(sidebartab.value);
    if (sidebartab.value !== ID) {
      showList.value = true;
      console.log("On");
    } else {
      showList.value = !showList.value;
      console.log("Off");
    }
    if (data[ID].li.length === 0) {
      sidebartabli.value = "none";
    } else {
      sidebartab.value = ID;
    }
  };

  let handleOutsideAna = (e) => {
    if (isMobile) {
      if (!ana_icon.current.contains(e.target)) {
        if (!ana_box.current.contains(e.target)) {
          anamenu.value = false;
        }
      }
    }
  };

  let handleOutsideSet = (e) => {
    if (isMobile) {
      if (!set_icon.current.contains(e.target)) {
        if (!set_box.current.contains(e.target)) {
          setmenu.value = false;
        }
      }
    }
  };

  const handleMenuLi = (e) => {
    const ID = e.currentTarget.id;
    sidebartabli.value = ID;
  };

  const MenuClassic = (id, label) => {
    return (
      <div
        className="DAT_Sidenar_Content"
        id={id}
        onClick={(event) => {
          handleMenu(event);
        }}
      >
        <div
          className="DAT_Sidenar_Content-icon"
          style={{
            color:
              sidebartab.value === id
                ? dataColor.cur.color
                : dataColor.pre.color,
          }}
        >
          {data[id].icon}
        </div>
        {data[id].link === "none" ? (
          <label
            style={{
              color:
                sidebartab.value === id
                  ? dataColor.cur.color
                  : dataColor.pre.color,
            }}
          >
            {label}
          </label>
        ) : (
          <Link to={data[id].link} style={{ textDecoration: "none" }}>
            <label
              style={{
                color:
                  sidebartab.value === id
                    ? dataColor.cur.color
                    : dataColor.pre.color,
              }}
            >
              {label}
            </label>
          </Link>
        )}
        <div
          className="DAT_Sidenar_Content-arrow"
          style={{ color: "rgb(141, 139, 139)" }}
        >
          {data[id].li.length === 0 ? (
            <></>
          ) : sidebartab.value === id ? (
            <IoIosArrowDown color="gray" />
          ) : (
            <IoIosArrowForward color="gray" />
          )}
        </div>
      </div>
    );
  };

  const MenuNew = (id, label, top, left) => {
    return id === "Dashboard" ? (
      <div
        className="DAT_NewSidenar_NewContent"
        id={id}
        style={{
          color: "white",
          backgroundColor: sidebartab.value === id ? dataColor.cur.bg : "",
          borderRadius: "10px",
        }}
        onClick={(event) => {
          sidebartab.value = id;
          handleMenu(event);
          navigate("/");
        }}
      >
        <div style={{ fontSize: "23px" }}>{data2[id].icon}</div>
      </div>
    ) : (
      <div
        className="DAT_NewSidenar_NewContent"
        id={id}
        style={{
          color: "white",
          backgroundColor: sidebartab.value === id ? dataColor.cur.bg : "",
          borderRadius: "10px",
        }}
        onClick={(event) => {
          handleMenu(event);
        }}
      >
        <div style={{ fontSize: "23px" }}>{data2[id].icon}</div>
      </div>
    );
  };

  const MenuLi = (id) => {
    return viewMode.value ? (
      <div className="DAT_Sidenar_list">
        <div className="DAT_Sidenar_list-accordion">
          {data[id].li.map((data, index) => {
            return data.link === "none" ? (
              <label key={id + "_" + index}>{data.name}</label>
            ) : (
              <Link
                key={id + "_" + index}
                to={data.link}
                style={{ textDecoration: "none" }}
              >
                <label
                  id={data.link}
                  onClick={(e) => {
                    handleMenuLi(e);
                  }}
                  style={{
                    color:
                      sidebartabli.value === data.link
                        ? dataColor.cur.color
                        : dataColor.pre.color,
                  }}
                >
                  {data.name}
                </label>
              </Link>
            );
          })}
        </div>
      </div>
    ) : (
      <div className="DAT_NewSidenar_newlist">
        <div className="DAT_NewSidenar_newlist-accordion">
          {data[id].li.map((data, index) => {
            return data.link === "none" ? (
              <label key={id + "_" + index}>{data.name}</label>
            ) : (
              <Link
                key={id + "_" + index}
                to={data.link}
                style={{ textDecoration: "none" }}
              >
                <label
                  id={data.link}
                  onClick={(e) => {
                    handleMenuLi(e);
                  }}
                  style={{
                    color:
                      sidebartabli.value === data.link
                        ? dataColor.cur.color2
                        : dataColor.pre.color2,
                    backgroundColor:
                      sidebartabli.value === data.link ? "#e8e8e8" : "",
                    borderRadius:
                      sidebartabli.value === data.link
                        ? "0px 10px 10px 0px"
                        : "0px",
                  }}
                >
                  {data.name}
                </label>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  const handleShadow = () => {
    sidenar.value = !sidenar.value;
  };

  const handleDirect = (link) => {
    navigate(link);
  };

  useEffect(function () {
    isMobile.value ? (sidenar.value = false) : (sidenar.value = true);

    document.addEventListener("mousedown", handleOutsideAna);
    document.addEventListener("mousedown", handleOutsideSet);
    return () => {
      document.removeEventListener("mousedown", handleOutsideAna);
      document.removeEventListener("mousedown", handleOutsideSet);
    };
  }, []);

  useEffect(() => {
    sys.value = [];
    const which = {
      auto: "Auto",
      energy: "Energy",
      elev: "Elev",
    };

    const which_ = ["energy", "auto", "elev"];
    Object.keys(ruleInfor.value.setting.system).map((key) => {
      if (ruleInfor.value.setting.system[key] === false) {
        which_.splice(which_.indexOf(key), 1);
      }
    });
    console.log(which_);
    if (which_.length > 1) {
      which_.map((key) => {
        sys.value = [
          ...sys.value,
          { link: `/${which[key]}`, name: dataLang.formatMessage({ id: key }) },
        ];
      });
    }
  }, [ruleInfor.value, lang]);

  useEffect(() => {
    if (viewMode.value) {
      raiseInfo.value = false;
    }
    if (sidenar.value) {
      showList.value = false;
      raiseInfo.value = false;
    } else {
      showList.value = false;
      raiseInfo.value = false;
    }
  }, [sidenar.value, viewMode.value]);

  const SelectBox = () => {
    const position = {
      Dashboard: { top: "70px", left: "70px" },
      Analytics: { top: "130px", left: "70px" },
      Setting: { top: "190px", left: "70px" },
      // Setting: { top: "220px", left: "70px" },
      // Notif: { top: "270px", left: "70px" },
    };

    return (
      <div
        className="DAT_SelectBox"
        style={{
          top: position[sidebartab.value].top,
          left: position[sidebartab.value].left,
          width: showList.value ? "fit-content" : "0",
          transition: "0.5s",
        }}
      >
        <div className="DAT_SelectBox_Title">
          {dataLang.formatMessage({ id: sidebartab.value.toLowerCase() })}
        </div>
        {data[sidebartab.value].li.map((data, index) => {
          return (
            <div key={index} className="DAT_SelectBox_Option" id={data.link}>
              {data.link === "none" ? (
                <label key={sidebartab.value + "_" + index}>{data.name}</label>
              ) : (
                <Link
                  key={sidebartab.value + "_" + index}
                  to={data.link}
                  style={{ textDecoration: "none" }}
                  id={data.link}
                  onClick={(e) => {
                    handleMenuLi(e);
                  }}
                >
                  <label>{data.name}</label>
                </Link>
              )}
              ;
            </div>
          );
        })}
      </div>
    );
  };

  const InforBox = () => {
    return (
      <div className="DAT_InforBox">
        <div className="DAT_InforBox_Col">
          <img src="./dat_icon/Embody_APP_25.png" alt="user" />
        </div>
        <div className="DAT_InforBox_Col">
          <div className="DAT_InforBox_Col_Title">AIOT Energy</div>
          <div className="DAT_InforBox_Col_Content">
            {dataLang.formatMessage({ id: "sologon" })}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (isLandscape) {
      sidenar.value = false;
    }
  }, [isLandscape]);

  return (
    <>
      {isBrowser || isLandscape ? (
        <>
          {viewMode.value ? (
            <>
              <div
                className="DAT_Sidenar"
                style={sidenar.value ? { width: "200px" } : { width: "0px" }}
              >
                <div
                  style={
                    sidenar.value ? { display: "block" } : { display: "none" }
                  }
                >
                  {MenuClassic(
                    "Dashboard",
                    dataLang.formatMessage({ id: "dashboard" })
                  )}
                  {sidebartab.value === "Dashboard" ? (
                    <>{MenuLi("Dashboard")}</>
                  ) : (
                    <></>
                  )}

                  {MenuClassic(
                    "Analytics",
                    dataLang.formatMessage({ id: "maintain" })
                  )}
                  {sidebartab.value === "Analytics" ? (
                    <>{MenuLi("Analytics")}</>
                  ) : (
                    <></>
                  )}

                  {MenuClassic(
                    "Setting",
                    dataLang.formatMessage({ id: "setting" })
                  )}
                  {sidebartab.value === "Setting" ? (
                    <>{MenuLi("Setting")}</>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div
                className="DAT_User"
                style={{
                  width: sidenar.value ? "200px" : "0px",
                }}
              >
                <div
                  className="DAT_User-group"
                  style={
                    sidenar.value ? { display: "block" } : { display: "none" }
                  }
                >
                  <div className="DAT_User-group-Tit">
                    {dataLang.formatMessage({ id: "loginWith" })}
                  </div>
                  <div className="DAT_User-group-ID">
                    {userInfor.value.name}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                className="DAT_NewSidenar"
                style={{
                  width: sidenar.value ? "60px" : "0px",
                  transition: "0.3s",
                }}
              >
                {MenuNew(
                  "Dashboard",
                  dataLang.formatMessage({ id: "dashboard" })
                )}
                {MenuNew(
                  "Analytics",
                  dataLang.formatMessage({ id: "maintain" })
                )}
                {MenuNew("Setting", dataLang.formatMessage({ id: "setting" }))}
              </div>
              <div
                className="DAT_NewUser"
                style={{
                  width: sidenar.value ? "60px" : "0px",
                  transition: "0.3s",
                }}
              >
                <div
                  className="DAT_NewUser_Icon"
                  onClick={() => {
                    raiseInfo.value = !raiseInfo.value;
                  }}
                >
                  <img src="./dat_icon/Embody_APP_25.png" alt="user" />
                </div>
              </div>
            </>
          )}
          <div
            className="DAT_Shadow"
            id="DAT_Shadow"
            style={sidenar.value ? { display: "block" } : { display: "none" }}
            onClick={(event) => {
              handleShadow(event);
            }}
          ></div>
          {raiseInfo.value ? <InforBox /> : <></>}
          {viewMode.value ? <></> : <SelectBox />}
        </>
      ) : (
        <>
          <div className="DAT_SidenarMobile">
            <div
              id="Dashboard"
              className="DAT_SidenarMobile_Item"
              onClick={(e) => {
                handleMenu(e);
              }}
              style={{
                color:
                  sidebartab.value === "Dashboard"
                    ? dataColor.cur.color
                    : dataColor.pre.color,
              }}
            >
              {data["Dashboard"].link === "none" ? (
                <div style={{ textAlign: "center" }}>
                  <div className="DAT_SidenarMobile_Item_Icon">
                    {sidebartab.value === "Dashboard"
                      ? data["Dashboard"].iconmobilefull
                      : data["Dashboard"].iconmobile}
                  </div>
                  <span>{dataLang.formatMessage({ id: "dashboard" })}</span>
                </div>
              ) : (
                <Link
                  to={data["Dashboard"].link}
                  style={{
                    textDecoration: "none",
                    color:
                      sidebartab.value === "Dashboard"
                        ? dataColor.cur.color
                        : dataColor.pre.color,
                    textAlign: "center",
                  }}
                >
                  <div className="DAT_SidenarMobile_Item_Icon">
                    {sidebartab.value === "Dashboard"
                      ? data["Dashboard"].iconmobilefull
                      : data["Dashboard"].iconmobile}
                  </div>
                  <span>{dataLang.formatMessage({ id: "dashboard" })}</span>
                </Link>
              )}
            </div>

            <div
              id="Analytics"
              className="DAT_SidenarMobile_Item"
              onClick={(e) => {
                handleMenu(e);
                anamenu.value = !anamenu.value;
              }}
              ref={ana_icon}
              style={{
                color:
                  sidebartab.value === "Analytics"
                    ? dataColor.cur.color
                    : dataColor.pre.color,
              }}
            >
              {data["Analytics"].link === "none" ? (
                <div style={{ textAlign: "center" }}>
                  <div className="DAT_SidenarMobile_Item_Icon">
                    {sidebartab.value === "Analytics"
                      ? data["Analytics"].iconmobilefull
                      : data["Analytics"].iconmobile}
                  </div>
                  <span>{dataLang.formatMessage({ id: "maintain" })}</span>
                </div>
              ) : (
                <Link
                  to={data["Analytics"].link}
                  style={{
                    textDecoration: "none",
                    color:
                      sidebartab.value === "Analytics"
                        ? dataColor.cur.color
                        : dataColor.pre.color,
                    textAlign: "center",
                  }}
                >
                  <div className="DAT_SidenarMobile_Item_Icon">
                    {sidebartab.value === "Analytics"
                      ? data["Analytics"].iconmobilefull
                      : data["Analytics"].iconmobile}
                  </div>
                  <span>{dataLang.formatMessage({ id: "maintain" })}</span>
                </Link>
              )}
            </div>

            <div
              id="Setting"
              className="DAT_SidenarMobile_Item"
              ref={set_icon}
              onClick={(e) => {
                handleMenu(e);
                setmenu.value = !setmenu.value;
              }}
              style={{
                color:
                  sidebartab.value === "Setting"
                    ? dataColor.cur.color
                    : dataColor.pre.color,
              }}
            >
              {data["Setting"].link === "none" ? (
                <div style={{ textAlign: "center" }}>
                  <div className="DAT_SidenarMobile_Item_Icon">
                    {sidebartab.value === "Setting"
                      ? data["Setting"].iconmobilefull
                      : data["Setting"].iconmobile}
                  </div>
                  <span>{dataLang.formatMessage({ id: "setting" })}</span>
                </div>
              ) : (
                <Link
                  to={data["Setting"].link}
                  style={{
                    textDecoration: "none",
                    color:
                      sidebartab.value === "Setting"
                        ? dataColor.cur.color
                        : dataColor.pre.color,
                    textAlign: "center",
                  }}
                >
                  <div className="DAT_SidenarMobile_Item_Icon">
                    {sidebartab.value === "Setting"
                      ? data["Setting"].iconmobilefull
                      : data["Setting"].iconmobile}
                  </div>
                  <span>{dataLang.formatMessage({ id: "setting" })}</span>
                </Link>
              )}
            </div>
          </div>

          <div
            className="DAT_AnalyticsMenu"
            style={{ display: anamenu.value ? "block" : "none" }}
            ref={ana_box}
          >
            {data["Analytics"].li.map((data, index) => {
              return data.link === "none" ? (
                <span key={index}>{data.name}</span>
              ) : (
                <div
                  className="DAT_AnalyticsMenu_Item"
                  key={index}
                  onClick={() => {
                    handleDirect(data.link);
                    anamenu.value = false;
                  }}
                >
                  {data.name}
                </div>
              );
            })}
          </div>

          <div
            className="DAT_SettingMenu"
            style={{ display: setmenu.value ? "block" : "none" }}
            ref={set_box}
          >
            {data["Setting"].li.map((data, index) => {
              return data.link === "none" ? (
                <span key={index}>{data.name}</span>
              ) : (
                <div
                  className="DAT_SettingMenu_Item"
                  key={index}
                  onClick={() => {
                    handleDirect(data.link);
                    setmenu.value = false;
                  }}
                >
                  {data.name}
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
