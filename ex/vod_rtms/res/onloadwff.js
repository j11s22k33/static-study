var punycode = new function() {
	function a(n, o, f) {
		n = f ? Math.floor(n / e) : n >> 1;
		n += Math.floor(n / o);
		for (o = 0; n > (c - d) * g >> 1; o += c)
			n = Math.floor(n / (c - d));
		return Math.floor(o + (c - d + 1) * n / (n + k))
	}
	function b(n, o) {
		n -= (n - 97 < 26) << 5;
		return n + ((!o && n - 65 < 26) << 5)
	}
	this.utf16 = {
	decode : function(n) {
		for ( var o = [], f = 0, r = n.length, q, x; f < r;) {
			q = n.charCodeAt(f++);
			if ((q & 63488) === 55296) {
				x = n.charCodeAt(f++);
				if ((q & 64512) !== 55296 || (x & 64512) !== 56320)
					throw new RangeError("UTF-16(decode): Illegal UTF-16 sequence");
				q = ((q & 1023) << 10) + (x & 1023) + 65536
			}
			o.push(q)
		}
		return o
	},
	encode : function(n) {
		for ( var o = [], f = 0, r = n.length, q; f < r;) {
			q = n[f++];
			if ((q & 63488) === 55296)
				throw new RangeError("UTF-16(encode): Illegal UTF-16 value");
			if (q > 65535) {
				q -= 65536;
				o.push(String.fromCharCode(q >>> 10 & 1023 | 55296));
				q = 56320 | q & 1023
			}
			o.push(String.fromCharCode(q))
		}
		return o.join("")
	}
	};
	var c = 36, e = 700, d = 1, g = 26, k = 38;
	this.decode = function(n, o) {
		var f = [], r = [], q = n.length, x, j, p, u, w, z, J, H, D;
		x = 128;
		p = 0;
		u = 72;
		w = n.lastIndexOf("-");
		if (w < 0)
			w = 0;
		for (z = 0; z < w; ++z) {
			if (o)
				r[f.length] = n.charCodeAt(z) - 65 < 26;
			if (n.charCodeAt(z) >= 128)
				throw new RangeError("Illegal input >= 0x80");
			f.push(n.charCodeAt(z))
		}
		for (w = w > 0 ? w + 1 : 0; w < q;) {
			z = p;
			j = 1;
			for (J = c;; J += c) {
				if (w >= q)
					throw RangeError("punycode_bad_input(1)");
				H = n.charCodeAt(w++);
				H = H - 48 < 10 ? H - 22 : H - 65 < 26 ? H - 65 : H - 97 < 26 ? H - 97 : c;
				if (H >= c)
					throw RangeError("punycode_bad_input(2)");
				if (H > Math.floor((2147483647 - p) / j))
					throw RangeError("punycode_overflow(1)");
				p += H * j;
				D = J <= u ? d : J >= u + g ? g : J - u;
				if (H < D)
					break;
				if (j > Math.floor(2147483647 / (c - D)))
					throw RangeError("punycode_overflow(2)");
				j *= c - D
			}
			j = f.length + 1;
			u = a(p - z, j, z === 0);
			if (Math.floor(p / j) > 2147483647 - x)
				throw RangeError("punycode_overflow(3)");
			x += Math.floor(p / j);
			p %= j;
			o && r.splice(p, 0, n.charCodeAt(w - 1) - 65 < 26);
			f.splice(p, 0, x);
			p++
		}
		if (o) {
			p = 0;
			for (q = f.length; p < q; p++)
				if (r[p])
					f[p] = String.fromCharCode(f[p]).toUpperCase().charCodeAt(0)
		}
		return this.utf16.encode(f)
	};
	this.encode = function(n, o) {
		var f, r, q, x, j, p, u, w, z, J;
		if (o)
			J = this.utf16.decode(n);
		n = this.utf16.decode(n.toLowerCase());
		var H = n.length;
		if (o)
			for (p = 0; p < H; p++)
				J[p] = n[p] != J[p];
		var D = [];
		f = 128;
		r = 0;
		j = 72;
		for (p = 0; p < H; ++p)
			if (n[p] < 128)
				D.push(String.fromCharCode(J ? b(n[p], J[p]) : n[p]));
		q = x = D.length;
		for (x > 0 && D.push("-"); q < H;) {
			u = 2147483647;
			for (p = 0; p < H; ++p) {
				w = n[p];
				if (w >= f && w < u)
					u = w
			}
			if (u - f > Math.floor((2147483647 - r) / (q + 1)))
				throw RangeError("punycode_overflow (1)");
			r += (u - f) * (q + 1);
			f = u;
			for (p = 0; p < H; ++p) {
				w = n[p];
				if (w < f)
					if (++r > 2147483647)
						return Error("punycode_overflow(2)");
				if (w == f) {
					u = r;
					for (w = c;; w += c) {
						z = w <= j ? d : w >= j + g ? g : w - j;
						if (u < z)
							break;
						D.push(String.fromCharCode(z + (u - z) % (c - z) + 22 + 75 * (z + (u - z) % (c - z) < 26) - (false << 5)));
						u = Math.floor((u - z) / (c - z))
					}
					D.push(String.fromCharCode(u + 22 + 75 * (u < 26) - (((o && J[p] ? 1 : 0) != 0) << 5)));
					j = a(r, q + 1, q == x);
					r = 0;
					++q
				}
			}
			++r;
			++f
		}
		return D.join("")
	};
	this.get_host = function(n) {
		n = n;
		var o = n.indexOf("://");
		if (o != -1)
			n = n.substring(o + 3);
		o = n.indexOf("/");
		if (o != -1)
			n = n.substring(0, o);
		o = n.indexOf(":");
		if (o != -1)
			n = n.substring(0, o);
		if (n.indexOf(".", n.length - 1) != -1)
			n = n.substring(0, n.length - 1);
		return n
	};
	this.URLToASCII = function(n) {
		if (typeof n != "string")
			return n;
		var o = this.get_host(n), f = this.ToASCII(o);
		if (f == o)
			return n;
		return n.replace(o, f)
	};
	this.ToASCII = function(n) {
		n = n.split(".");
		for ( var o = [], f = 0; f < n.length; ++f) {
			var r = n[f];
			o.push(r.match(/[^A-Za-z0-9-]/) ? "xn--" + punycode.encode(r) : r)
		}
		return o.join(".")
	};
	this.URLToUnicode = function(n) {
		if (typeof n != "string")
			return n;
		var o = this.get_host(n), f = this.ToUnicode(o);
		if (f == o)
			return n;
		return n.replace(o, f)
	};
	this.ToUnicode = function(n) {
		n = n.split(".");
		for ( var o = [], f = 0; f < n.length; ++f) {
			var r = n[f];
			o.push(r.match(/^xn--/) ? punycode.decode(r.slice(4)) : r)
		}
		return o.join(".")
	}
}, ischrome = true, g_tsstart = (new Date).getTime(), g_bg = null, g_getdata_page = "", g_getdata_handler = null, g_user_prefs_to_write = [], g_global_prefs_to_write = [], g_delete_group_callback = null, g_delete_aid_callback = null, g_security_prompt_handler = null, g_language = null, g_included_language = false, g_language_data = "", g_attachname = "", g_attachbytes = "", DEFAULT_KEY_ITERATIONS = 500, g_langs = {
"" : "Default",
af_ZA : "Afrikaans",
ar : "Arabic",
ar_EG : "Arabic (Egypt)",
az_AZ : "Azerbaijani",
bg : "Bulgarian",
ca : "Catalan",
zh_CN : "Chinese (Simplified)",
zh_TW : "Chinese (Traditional)",
hr : "Croatian",
cs : "Czech",
da : "Danish",
nl : "Dutch",
en_US : "English",
en_GB : "English (United Kingdom)",
eo_US : "Esperanto",
et : "Estonian",
fi : "Finnish",
fr : "French",
fr_CA : "French (Canada)",
gl_ES : "Galician",
ka_GE : "Georgian",
de : "German",
el : "Greek",
he : "Hebrew",
hu : "Hungarian",
is_ID : "Icelandic",
id : "Indonesian",
it : "Italian",
ja : "Japanese",
ko : "Korean",
lv : "Latvian",
lt : "Lithuanian",
mk_MK : "Macedonian",
mg_MG : "Malagasy",
ms : "Malay",
nb : "Norwegian",
nn_NO : "Norwegian Nynorsk",
fa : "Persian",
pl : "Polish",
pt_PT : "Portuguese",
pt_BR : "Portuguese (Brazilian)",
ro : "Romanian",
ru : "Russian",
sr : "Serbian",
sk : "Slovak",
sl : "Slovenian",
es : "Spanish",
es_419 : "Spanish (Mexico)",
sv : "Swedish",
ta : "Tamil",
th : "Thai",
tr : "Turkish",
uk : "Ukrainian",
ur_PK : "Urdu",
vi : "Vietnamese"
}, g_webkit_selectable = g_isopera ? "" : "-webkit-user-select:none;", g_opera_selectable = g_isopera ? 'unselectable="on"' : "";
function include_language(a) {
	try {
		if (!g_included_language) {
			g_included_language = true;
			if (a == "") {
				a = navigator.language;
				a = a.replace("-", "_");
				if (a == "es_MX")
					a = "es_419";
				if (typeof g_langs[a] == "undefined")
					a = a.substring(0, 2);
				if (typeof g_langs[a] == "undefined")
					for ( var b in g_langs)
						if (b.substring(0, 2) == a) {
							a = b;
							break
						}
				if (typeof g_langs[a] == "undefined")
					a = "en_US"
			}
			var c = [];
			a != "en_US" && c.push("en_US");
			c.push(a);
			for (b = 0; b < c.length; b++)
				try {
					a = c[b];
					var e = new XMLHttpRequest, d = "_locales/" + a + "/messages.js";
					if (typeof safari != "undefined" && typeof safari.extension != "undefined" && typeof safari.extension.baseURI != "undefined")
						d = safari.extension.baseURI + d;
					e.open("GET", d, false);
					e.send(null);
					g_language_data = e.responseText;
					if (a == "en_US") {
						lptranslations = JSON.parse(g_language_data);
						g_language_data = "lptranslations=" + g_language_data
					} else {
						lptranslationsother = JSON.parse(g_language_data);
						g_language_data = "lptranslationsother=" + g_language_data
					}
					if (b > 0)
						for ( var g in lptranslationsother)
							lptranslations[g] = lptranslationsother[g]
				} catch (k) {
				}
		}
	} catch (n) {
	}
}
var matches = document.location.href.match(/[?&]lplanguage=([^&]*)/);
if (matches) {
	g_language = matches[1];
	include_language(g_language)
}
var lpgslocales = [], lpgscache = [];
function gs(a, b) {
	var c = a.replace(/[^a-zA-Z0-9_]/g, "_"), e = "";
	if (typeof b != "undefined" && b && typeof translations != "undefined" && typeof translations[b] != "undefined" && typeof translations[b][a] != "undefined")
		e = translations[b][a];
	else if (typeof chrome != "undefined" && typeof chrome.i18n != "undefined" && typeof chrome.i18n.getMessage == "function")
		e = chrome.i18n.getMessage(c);
	else if (typeof lptranslations != "undefined")
		if (typeof lptranslations[c] != "undefined" && typeof lptranslations[c].message != "undefined")
			e = lptranslations[c].message;
	if (typeof e == "undefined" || e == null)
		e = "";
	if (e == "")
		e = a;
	if (g_issafari) {
		e = e.replace(/Google Chrome/g, "Safari");
		e = e.replace(/Chrome/g, "Safari")
	} else if (g_isopera) {
		e = e.replace(/Google Chrome/g, "Opera");
		e = e.replace(/Chrome/g, "Opera")
	}
	return e
}
function upperFirstChar(a) {
	return a.charAt(0).toUpperCase() + a.slice(1).toLowerCase()
}
function CheckStringForObfuscation(a, b, c) {
	if (a.indexOf("ff_") != 0 || c == null || typeof c == "undefined" || c.indexOf("__") != 0)
		return lpgscache[b] = c;
	c = c.substr(2);
	a = "";
	for ( var e = 0; e < 8; e++)
		a += "arti";
	c = lpdec(c, a);
	return lpgscache[b] = c
}
function ApplyOverrides(a) {
	origlocale = a;
	a = a == "" ? "en-US" : a;
	var b = typeof g_ff == "undefined" ? "" : g_ff;
	if (b != null && b != "") {
		b = b.split("\n");
		for ( var c = false, e = 0; e < b.length; e++) {
			if (c && b[e].indexOf("lang=") == 0)
				return;
			if (!c && b[e] == "lang=" + a)
				c = true;
			else if (c) {
				var d = b[e].indexOf("=");
				if (d != -1) {
					var g = b[e].substr(0, d);
					d = b[e].substr(d + 1);
					CheckStringForObfuscation(g, origlocale + g, d)
				}
			}
		}
		lpgslocales[origlocale] = 1
	}
}
function ApplyAllOverrides() {
	lpgscache = [];
	lpgslocales = []
}
function sr(a, b, c, e) {
	(a = a.getElementById(b)) && a.setAttribute(c, gs(e))
}
function L(a) {
	console_log((new Date).getTime() - g_tsstart + " : " + a)
}
function probe(a, b) {
	var c = a;
	for (i in b) {
		var e = typeof b[i];
		if (e == "string" || e == "number")
			e = b[i];
		c += "\n" + i + " : " + e
	}
	L(c)
}
function getchromeurl(a, b) {
	if (g_ischrome)
		return chrome.extension.getURL(a);
	else if (g_issafari || g_isopera) {
		var c = "";
		if (typeof g_language != "undefined" && g_language)
			c = g_language;
		else if (typeof lpGetPref == "function")
			c = lpGetPref("language", "");
		b || (a += (a.indexOf("?") != -1 ? "&" : "?") + "lplanguage=" + encodeURIComponent(c));
		return (g_issafari ? safari.extension.baseURI : "") + a
	}
}
function getdata_message_handler(a) {
	if (g_isopera) {
		a.message = a.data;
		a.name = a.data.messagetype
	}
	if (a.name == "gotdata") {
		for ( var b in a.message)
			getBG()[b] = a.message[b];
		lp_iscbc = a.message.lp_iscbc;
		getBG().g_userprefs = LPJSON.parse(getBG().g_userprefsstr);
		g_userprefs = getBG().g_userprefs;
		getBG().g_gblprefs = LPJSON.parse(getBG().g_gblprefsstr);
		g_gblprefs = getBG().g_gblprefs;
		getBG().g_prompts = LPJSON.parse(getBG().g_promptsstr);
		g_prompts = getBG().g_prompts;
		if (g_getdata_page == "login") {
			if (getBG().g_reprompt_callback)
				getBG().g_reprompt_callback = function() {
					dispatch_message("reprompt_callback", {
						g_user_prefs_to_write : LPJSON.stringify(g_user_prefs_to_write)
					})
				};
			if (getBG().g_reprompt_error_callback)
				getBG().g_reprompt_error_callback = function() {
					dispatch_message("reprompt_error_callback", {})
				}
		} else if (g_getdata_page == "omnikey") {
			if (getBG().g_omnikey_callback)
				getBG().g_omnikey_callback = function(c) {
					dispatch_message("omnikey_callback", {
					pin : c,
					g_user_prefs_to_write : LPJSON.stringify(g_user_prefs_to_write)
					})
				}
		} else if (g_getdata_page == "vault") {
			if (typeof a.message.g_sites != "undefined")
				getBG().g_pendings = LPJSON.parse(getBG().g_pendings)
		} else if (g_getdata_page == "formfill")
			getBG().g_formfill_data = LPJSON.parse(getBG().g_formfill_data);
		else if (g_getdata_page == "site")
			getBG().g_site_data = fix_fields(LPJSON.parse(getBG().g_site_data));
		else if (g_getdata_page == "img")
			getBG().g_img_data = fix_fields(LPJSON.parse(getBG().g_img_data));
		if (typeof a.message.g_icons != "undefined")
			g_icons = getBG().g_icons = LPJSON.parse(getBG().g_icons);
		if (typeof a.message.g_sites != "undefined") {
			getBG().g_sites = LPJSON.parse(getBG().g_sites);
			if (typeof a.message.g_shares != "undefined")
				getBG().g_shares = LPJSON.parse(getBG().g_shares);
			if (typeof a.message.g_sites_tld != "undefined")
				getBG().g_sites_tld = LPJSON.parse(getBG().g_sites_tld);
			else
				getBG().g_sites_tld = getBG().g_sites
		}
		if (typeof a.message.g_securenotes != "undefined")
			getBG().g_securenotes = LPJSON.parse(getBG().g_securenotes);
		if (typeof a.message.g_applications != "undefined")
			getBG().g_applications = LPJSON.parse(getBG().g_applications);
		if (typeof a.message.g_formfills != "undefined")
			getBG().g_formfills = LPJSON.parse(getBG().g_formfills);
		if (typeof a.message.g_identities != "undefined")
			getBG().g_identities = LPJSON.parse(getBG().g_identities);
		if (typeof a.message.g_nevers != "undefined")
			getBG().g_nevers = LPJSON.parse(getBG().g_nevers);
		if (typeof a.message.g_prefoverrides != "undefined")
			getBG().g_prefoverrides = LPJSON.parse(getBG().g_prefoverrides);
		if (typeof a.message.g_create_account_data != "undefined")
			getBG().g_create_account_data = LPJSON.parse(getBG().g_create_account_data);
		if (typeof getBG().g_local_key != "undefined" && getBG().g_local_key != null) {
			g_local_key = getBG().g_local_key;
			g_local_key_hex = AES.bin2hex(g_local_key);
			g_local_key_hash = SHA256(g_local_key)
		}
		if (typeof getBG().ischrome != "undefined")
			ischrome = getBG().ischrome;
		g_getdata_handler()
	} else if (a.name == "delete_group_callback")
		typeof g_delete_group_callback == "function" && g_delete_group_callback();
	else if (a.name == "delete_aid_callback")
		typeof g_delete_aid_callback == "function" && g_delete_aid_callback();
	else if (a.name == "security_prompt_callback")
		typeof g_security_prompt_handler == "function" && g_security_prompt_handler();
	else if (a.name == "generatepasswordfound")
		typeof getBG().g_checkgeneratepasswordcallback == "function" && getBG().g_checkgeneratepasswordcallback();
	else if (a.name == "unprotect_data_callback") {
		for (b in passwords)
			if (passwords[b] == a.message.protected_data) {
				passwords[b] = a.message.unprotected_data;
				break
			}
		if (document.getElementById("p").value == a.message.protected_data)
			document.getElementById("p").value = a.message.unprotected_data
	} else if (a.name == "change_master_password_callback")
		g_change_master_password_callback(a.message.newdata);
	else if (a.name == "website_event_callback")
		website_event_callback(LPJSON.parse(a.message.data));
	else if (a.name == "fast_decryptatt_callback") {
		b = a.message.id;
		if (document.getElementById(b))
			if ((b = document.getElementById(b).getElementsByTagName("img")) && b.length > 0) {
				b = b[0];
				b.setAttribute("src", a.message.mimetype + ";base64," + a.message.result);
				getBG().have_nplastpass() ? b.addEventListener("click", function() {
					attachment_action_menu(this, showattach)
				}) : b.addEventListener("click", function() {
					showattach(this)
				})
			}
	} else if (a.name == "fast_encryptatt_callback") {
		g_encatt = LPJSON.parse(a.message.data);
		dosave(null, true)
	}
}
function get_data(a, b) {
	if (g_ischrome)
		b();
	else if (g_issafari) {
		safari.self.addEventListener("message", getdata_message_handler, false);
		g_getdata_page = a;
		g_getdata_handler = b;
		dispatch_message("getdata", {
			page : a
		})
	} else if (g_isopera) {
		opera.extension.onmessage = getdata_message_handler;
		g_getdata_page = a;
		g_getdata_handler = b;
		dispatch_message("getdata", {
			page : a
		})
	}
}
LPobj = this;
function fakebg() {
	this.processCS = function(a, b) {
		dispatch_message("processCS", {
			data : LPJSON.stringify(b)
		})
	};
	this.get_key_iterations = function() {
		return this.g_key_iterations
	};
	this.lpGetPref = function(a, b) {
		if (typeof lpGetPref != "undefined")
			return lpGetPref(a, b);
		else {
			if (typeof g_userprefs[a] != "undefined")
				return g_userprefs[a];
			if (typeof g_gblprefs[a] != "undefined")
				return g_gblprefs[a];
			return b
		}
	};
	this.lpPutUserPref = function(a, b) {
		g_user_prefs_to_write[a] = b
	};
	this.lpPutGblPref = function(a, b) {
		g_global_prefs_to_write[a] = b
	};
	this.lpWriteAllPrefs = function() {
	};
	this.LP_do_login = function(a, b, c, e, d, g, k, n) {
		dispatch_message("LP_do_login", {
		u : a,
		p : b,
		rememberemail : c,
		rememberpassword : e,
		donotclearmultifactor : d,
		showvault : g,
		lpkey : k,
		lphash : n
		})
	};
	this.openURL = function(a, b, c) {
		a = {
			url : a
		};
		if (c)
			a.g_site_data = LPJSON.stringify(c);
		dispatch_message("openURL", a)
	};
	this.install_binary = function() {
		dispatch_message("install_binary", {})
	};
	this.unlock_plug2web = function() {
		dispatch_message("unlock_plug2web", {})
	};
	this.set_last_reprompt_time = function() {
	};
	this.have_nplastpass = function() {
		return typeof this.g_have_nplastpass != "undefined" && this.g_have_nplastpass
	};
	this.can_copy_to_clipboard = function() {
		return typeof this.g_can_copy_to_clipboard != "undefined" && this.g_can_copy_to_clipboard
	};
	this.can_clear_clipboard = function() {
		return typeof this.g_can_clear_clipboard != "undefined" && this.g_can_clear_clipboard
	};
	this.copytoclipboard = function(a) {
		dispatch_message("copytoclipboard", {
			g_data : a
		})
	};
	this.is_chrome_portable = function() {
		return false
	};
	this.update_prefs = function(a) {
		var b = {
		page : a,
		g_user_prefs_to_write : LPJSON.stringify(g_user_prefs_to_write),
		g_global_prefs_to_write : LPJSON.stringify(g_global_prefs_to_write)
		};
		if (a == "generate")
			b.g_genpws = this.g_genpws;
		dispatch_message("update_prefs", b)
	};
	this.update_prompts = function() {
		var a = {
			g_prompts : LPJSON.stringify(g_prompts)
		};
		dispatch_message("update_prompts", a)
	};
	this.check_ident_aid = function() {
		return true
	};
	this.check_ident_appaid = function() {
		return true
	};
	this.check_ident_ffid = function() {
		return true
	};
	this.DeleteOTP = function() {
	};
	this.deletesavedpw = function() {
	};
	this.start_idle_checker = function() {
	};
	this.setprefs = function() {
	};
	this.get_searchNotesPref = function() {
		return this.searchinnotes
	};
	this.IsIconsUpdated = function(a) {
		if (this.lpclearrecent) {
			this.lpclearrecent = false;
			return true
		}
		return this.g_icons_length != a
	};
	this.getClearRecentTime = function() {
		return this.clearRecentTime
	};
	this.getRecentCount = function() {
		return this.recentCount
	};
	this.hex2bin = function(a) {
		return AES.hex2bin(a)
	};
	this.bin2hex = function(a) {
		return AES.bin2hex(a)
	};
	this.lp_sort_case_insensitive_name = function(a, b) {
		a = a.name.toLowerCase();
		b = b.name.toLowerCase();
		return a < b ? -1 : 1
	};
	this.geticonhtml = function(a, b) {
		return geticonhtml(a, b)
	};
	this.geticonhtmlfromrecord = function(a) {
		return geticonhtmlfromrecord(a)
	};
	this.geticonurl = function(a, b) {
		return geticonurl(a, b)
	};
	this.geticonurlfromrecord = function(a) {
		return geticonurlfromrecord(a)
	};
	this.db_prepend = function(a) {
		return a
	};
	this.dec = function(a, b, c) {
		return dec(a, b, c)
	};
	this.enc = function(a, b) {
		return enc(a, b)
	};
	this.lpmdec = function(a, b, c) {
		var e = null;
		if (c)
			e = AES.bin2hex(c);
		return lpmdec(a, b, c, e)
	};
	this.lpmdec_acct = lpmdec_acct;
	this.lpmenc = function(a, b, c) {
		return lpmenc(a, b, c)
	};
	this.lpenc = function(a, b) {
		return lpenc(a, b)
	};
	this.lpdec = function(a, b) {
		return lpdec(a, b)
	};
	this.openall = function(a) {
		dispatch_message("openall", {
			group : a
		})
	};
	this.deleteGroup = function(a, b, c) {
		if (!(g_isopera && !confirm(gs("Are you sure you would like to delete?")))) {
			g_delete_group_callback = c;
			dispatch_message("deleteGroup", {
				group : a
			})
		}
	};
	this.copyusername = function(a) {
		dispatch_message("copyusername", {
			aid : a
		})
	};
	this.copypassword = function(a) {
		dispatch_message("copypassword", {
			aid : a
		})
	};
	this.copyurl = function(a) {
		dispatch_message("copyurl", {
			aid : a
		})
	};
	this.copynote = function(a) {
		dispatch_message("copynote", {
			aid : a
		})
	};
	this.deleteAid = function(a, b, c, e, d) {
		if (!(g_isopera && !confirm(gs("Are you sure you would like to delete?")))) {
			g_delete_aid_callback = d;
			dispatch_message("deleteAid", {
				aid : a
			})
		}
	};
	this.editAid = function(a) {
		dispatch_message("editAid", {
			aid : a
		})
	};
	this.gotourl = function(a) {
		dispatch_message("gotourl", {
			aid : a
		})
	};
	this.launch = function(a) {
		dispatch_message("launch", {
			aid : a
		})
	};
	this.open_login = function(a) {
		dispatch_message("open_login", {
			forcetab : a
		})
	};
	this.addprofile = function() {
		dispatch_message("addprofile", {})
	};
	this.update_create_account_data = function() {
		dispatch_message("update_create_account_data", {
			create_account_data : LPJSON.stringify(getBG().g_create_account_data)
		})
	};
	this.lpMakeRequest = function(a, b, c, e, d, g) {
		LP = LPobj;
		lpMakeRequest(a, b, c, e, d, g)
	};
	this.addcreditcard = function() {
		dispatch_message("addcreditcard", {})
	};
	this.editprofile = function(a) {
		dispatch_message("editprofile", {
			ffid : a
		})
	};
	this.deleteformfill = function(a) {
		dispatch_message("deleteformfill", {
			ffid : a
		})
	};
	this.openprefs = function(a) {
		dispatch_message("openprefs", {
			tab : a
		})
	};
	this.openbaseurl = function(a) {
		dispatch_message("openbaseurl", {
			suffix : a
		})
	};
	this.changemasterpassword = function() {
		dispatch_message("changemasterpassword", {})
	};
	this.openaddsecurenote = function() {
		dispatch_message("openaddsecurenote", {})
	};
	this.loggedOut = function(a, b) {
		dispatch_message("loggedOut", {
		skiprequest : a,
		from : b
		})
	};
	this.switch_identity = function(a) {
		dispatch_message("switch_identity", {
			iid : a
		})
	};
	this.renameGroup = function(a, b) {
		dispatch_message("renameGroup", {
		origgrp : a,
		newgrp : b
		})
	};
	this.addEmptyGroup = function(a) {
		dispatch_message("addEmptyGroup", {
			newgrp : a
		})
	};
	this.moveSelectedToGroup = function(a, b) {
		dispatch_message("moveSelectedToGroup", {
		group : a,
		aids : b
		})
	};
	this.en = function(a) {
		return encodeURIComponent(a)
	};
	this.update_state = function(a) {
		g_getdata_page = "vault";
		if (a == "vault")
			g_getdata_handler = function() {
				checkLoggedInHome(true)
			};
		else if (a == "search")
			g_getdata_handler = function() {
				checkVersion(true)
			};
		dispatch_message("getdata", {
		page : "vault",
		g_username : this.g_username,
		g_local_accts_version : this.g_local_accts_version,
		lploggedin : this.lploggedin,
		g_identity : this.g_identity,
		g_isadmin : this.g_isadmin,
		g_enterpriseuser : this.g_enterpriseuser,
		g_iscompanyadmin : this.g_iscompanyadmin,
		g_token : this.g_token,
		g_premium_exp : this.g_premium_exp,
		g_showcredmon : this.g_showcredmon
		})
	};
	this.security_prompt = function(a) {
		g_security_prompt_handler = a;
		dispatch_message("security_prompt", {})
	};
	this.savePassword = function(a, b, c, e) {
		dispatch_message("savePassword", {
		pass : a,
		url : b,
		tabid : c,
		nofill : e
		})
	};
	this.checkgeneratepassword = function(a) {
		dispatch_message("checkgeneratepassword", {
			tabid : a
		})
	};
	this.fillform = function(a, b, c, e) {
		dispatch_message("fillform", {
		ffid : a,
		origtabid : c,
		ccffid : e
		})
	};
	this.getsites = function() {
		return this.g_sites_tld
	};
	this.changePassword = function(a, b) {
		dispatch_message("changePassword", {
		password : a,
		aids : b
		})
	};
	this.getusernamefromacct = function(a) {
		return getusernamefromacct(a)
	};
	this.getpasswordfromacct = function(a) {
		return getpasswordfromacct(a)
	};
	this.geturlfromacct = function(a) {
		return geturlfromacct(a)
	};
	this.receiveTS = function(a, b) {
		dispatch_message("receiveTS", b)
	};
	this.deleteformfill = function(a) {
		dispatch_message("deleteformfill", {
			ffid : a
		})
	};
	this.addeditformfill = function(a, b) {
		dispatch_message("addeditformfill", {
		ffdata : LPJSON.stringify(a),
		site : LPJSON.stringify(b)
		})
	};
	this.getname_url = function(a) {
		return getname_url(a)
	};
	this.createNewAcct = function() {
		return createNewAcct()
	};
	this.fix_tlds = function(a, b, c) {
		dispatch_message("fix_tlds", {
		oldtld : a,
		newtld : b,
		aid : c
		})
	};
	this.moveIntoSharedFolder = function(a, b, c, e, d) {
		d || (d = false);
		dispatch_message("moveIntoSharedFolder", {
		shareinfo : LPJSON.stringify(a),
		shareinfoorig : LPJSON.stringify(b),
		aidsThatChangedGroups : LPJSON.stringify(c),
		aidsnewgrps : LPJSON.stringify(e),
		copy : d
		})
	};
	this.increment_local_accts_version = function() {
		dispatch_message("increment_local_accts_version", {})
	};
	this.rewritelocalfile = function() {
		dispatch_message("rewritelocalfile", {})
	};
	this.saveSite = function(a, b) {
		dispatch_message("saveSite", {
		postdata : a,
		acct : LPJSON.stringify(b)
		})
	};
	this.showImageAttach = function(a) {
		dispatch_message("showImageAttach", {
			data : a
		})
	};
	this.openAttach = function(a, b, c) {
		dispatch_message("openAttach", {
		id : a,
		attachid : b,
		filename : c
		})
	};
	this.exportAttachment = function(a, b, c) {
		dispatch_message("exportAttachment", {
		id : a,
		attachid : b,
		filename : c
		})
	};
	this.addAttach = function() {
		get_data("attach", function() {
			addattachcb()
		})
	};
	this.openLinkedSites = function(a, b) {
		dispatch_message("openLinkedSites", {
		password : a,
		tld : b
		})
	};
	this.saveAllSite = function(a, b) {
		dispatch_message("saveAllSite", {
		postdata : a,
		acct : LPJSON.stringify(b)
		})
	};
	this.saveSiteFromSubmit = function(a, b) {
		dispatch_message("saveSiteFromSubmit", {
		postdata : a,
		acct : LPJSON.stringify(b)
		})
	};
	this.saveFields = function(a, b, c) {
		dispatch_message("saveFields", {
		getdata : a,
		postdata : b,
		aData : LPJSON.stringify(c)
		})
	};
	this.update_site = function(a) {
		(a = get_record(a)) && dispatch_message("update_site", {
			site : LPJSON.stringify(a)
		})
	};
	this.applyattacharraychanges = function(a) {
		dispatch_message("applyattacharraychanges", {
			changes : LPJSON.stringify(a)
		})
	};
	this.update_fields = function(a, b) {
		dispatch_message("update_fields", {
		aid : a,
		fields : LPJSON.stringify(b)
		})
	};
	this.fastDecryptAttachment = function(a, b, c, e, d) {
		dispatch_message("fastDecryptAttachment", {
		id : a,
		mimetype : b,
		data : c,
		attachkey : e,
		key : d
		})
	};
	this.fastEncryptAttachments = function(a, b) {
		dispatch_message("fastEncryptAttachments", {
		akey : a,
		attachments : LPJSON.stringify(b)
		})
	};
	this.set_editfieldsopener = function() {
		dispatch_message("set_editfieldsopener", {})
	};
	this.close_editfieldsopener = function() {
		dispatch_message("close_editfieldsopener", {})
	};
	this.unprotect_data = function(a) {
		dispatch_message("unprotect_data", {
			data : a
		});
		return a
	};
	this.select_selectedtabid = function() {
		dispatch_message("select_selectedtabid", {})
	};
	this.closecurrenttab = function(a) {
		g_isopera ? window.close() : dispatch_message("closecurrenttab", {
			page : a
		})
	};
	this.add_identity = function() {
		dispatch_message("add_identity", {})
	};
	this.checkforupdates = function() {
		dispatch_message("checkforupdates", {})
	};
	this.clearforms = function() {
		dispatch_message("clearforms", {})
	};
	this.clearrecent = function() {
		dispatch_message("clearrecent", {})
	};
	this.openabout = function() {
		dispatch_message("openabout", {})
	};
	this.openaddsite = function() {
		dispatch_message("openaddsite", {})
	};
	this.openchooseprofilecc = function() {
		dispatch_message("openchooseprofilecc", {})
	};
	this.doexport = function() {
		dispatch_message("openexport", {})
	};
	this.openexport = function() {
		dispatch_message("openexport", {})
	};
	this.openfavorites = function() {
		dispatch_message("openfavorites", {})
	};
	this.openfeedback = function() {
		dispatch_message("openfeedback", {})
	};
	this.opengenpw = function() {
		dispatch_message("opengenpw", {})
	};
	this.openhelp = function() {
		dispatch_message("openhelp", {})
	};
	this.openimport = function() {
		dispatch_message("openimport", {})
	};
	this.doimport = function(a, b) {
		dispatch_message("doimport", {
		source : a,
		filename : b
		})
	};
	this.openimportchrome = function() {
		dispatch_message("openimportchrome", {})
	};
	this.openlastpassexport = function() {
		dispatch_message("openlastpassexport", {})
	};
	this.wlanexport = function() {
		dispatch_message("wlanexport", {})
	};
	this.formfillexport = function() {
		dispatch_message("formfillexport", {})
	};
	this.openpremium = function() {
		dispatch_message("openpremium", {})
	};
	this.openentconsole = function() {
		dispatch_message("openentconsole", {})
	};
	this.opensearch = function() {
		dispatch_message("opensearch", {})
	};
	this.openseccheck = function() {
		dispatch_message("openseccheck", {})
	};
	this.opensessions = function() {
		dispatch_message("opensessions", {})
	};
	this.openvault = function() {
		dispatch_message("openvault", {})
	};
	this.recheckpage = function() {
		dispatch_message("recheckpage", {})
	};
	this.refreshsites = function() {
		dispatch_message("refreshsites", {})
	};
	this.saveall = function() {
		dispatch_message("saveall", {})
	};
	this.upgradetoserver = function() {
		dispatch_message("upgradetoserver", {})
	};
	this.clearCache = function(a) {
		dispatch_message("clearCache", {
			noprompt : a
		})
	};
	this.loglogin = function(a) {
		dispatch_message("loglogin", {
			aid : a
		})
	};
	this.deleteNever = function(a) {
		dispatch_message("deleteNever", {
			n : LPJSON.stringify(a)
		})
	};
	this.fillaid = function(a) {
		dispatch_message("fillaid", {
			aid : a
		})
	};
	this.openprint = function(a) {
		dispatch_message("openprint", {
			notes : a
		})
	};
	this.getmatchingsites = function() {
		var a = this.g_sites_tld, b, c, e = [];
		for (b in a) {
			c = a[b].aid;
			if (typeof this.g_sites[c] != "undefined") {
				c = this.g_sites[c];
				e.push({
				aid : c.aid,
				name : c.name,
				username : getusernamefromacct(c),
				fiid : c.fiid
				})
			}
		}
		return e
	};
	this.getnevers = function() {
		return this.g_nevers
	};
	this.getmenuheight = function() {
		return g_menuheight
	};
	this.isadmin = function() {
		if (typeof this.g_isadmin != "undefined")
			return this.g_isadmin;
		return false
	};
	this.getbaseurl = function() {
		if (typeof this.base_url != "undefined")
			return this.base_url;
		return "https://lastpass.com/"
	};
	this.change_master_password = function(a, b, c, e) {
		g_change_master_password_callback = e;
		dispatch_message("change_master_password", {
		newusername : a,
		newpassword : b,
		toserver : c
		})
	};
	this.lpvt_store_data_and_setsinglefactortype = function(a) {
		dispatch_message("lpvt_store_data_and_setsinglefactortype", {
			data : a
		})
	};
	this.delete_file = function(a) {
		dispatch_message("delete_file", {
			f : a
		})
	};
	this.lpevent = function(a) {
		dispatch_message("lpevent", {
			w : a
		})
	}
}
function getBG() {
	if (g_bg != null)
		return g_bg;
	try {
		if (g_ischrome) {
			if (typeof chrome.extension.getBackgroundPage == "function") {
				g_bg = chrome.extension.getBackgroundPage();
				if (g_bg != null)
					return g_bg
			}
			var a = chrome.extension.getViews(), b;
			for (b in a)
				if (typeof a[b].receiveTS == "function")
					return g_bg = a[b]
		} else if (g_issafari || g_isopera) {
			if (g_issafari) {
				if (typeof safari.extension.globalPage != "undefined")
					return g_bg = safari.extension.globalPage.contentWindow
			} else if (g_isopera)
				if (typeof g_opera_button != "undefined")
					return this;
			return g_bg = new fakebg
		}
		L("TS : getBG FAILED");
		return null
	} catch (c) {
		L("TS : getBG FAILED error=" + c)
	}
	return null
}
function array_length(a) {
	var b = 0, c;
	for (c in a)
		b++;
	return b
}
Clipboard = {};
Clipboard.utilities = {};
Clipboard.utilities.createTextArea = function(a) {
	var b = document.createElement("textarea");
	b.style.position = "absolute";
	b.style.left = "-100%";
	if (a != null)
		b.value = a;
	document.body.appendChild(b);
	return b
};
Clipboard.copy = function(a) {
	if (a != null) {
		if (a == "")
			a = " ";
		a = Clipboard.utilities.createTextArea(a);
		a.select();
		document.execCommand("Copy");
		document.body.removeChild(a)
	}
};
Clipboard.paste = function() {
	var a = Clipboard.utilities.createTextArea();
	a.focus();
	document.execCommand("Paste");
	var b = a.value;
	document.body.removeChild(a);
	return b
};
function es(a) {
	a = a.replace(/\\/g, "\\\\");
	a = a.replace(/'/g, "\\'");
	return a = a.replace(/"/g, '\\"')
}
function show_password_meter(a) {
	document.writeln('<div id="page_passwordmeterback" style="text-align:left;height:10px;border:1px solid #B5B8C8;width:' + a + 'px;background-image:url(images/passwordmeter_back.gif);margin-top:3px;">');
	document.writeln('<div id="page_passwordmeterfront" style="background-image:url(images/passwordmeter_front.gif);height:10px;width:50px;line-height:1px;font-size:1px;">');
	document.writeln("</div>");
	document.writeln("</div>")
}
function update_password_meter(a, b) {
	var c = getpasswordstrength(a, b);
	update_password_meter_manual(c)
}
function update_password_meter_manual(a) {
	var b = parseInt(document.getElementById("page_passwordmeterback").style.width);
	a = Math.round(a * b / 100) + "px";
	document.getElementById("page_passwordmeterfront").style.width = a
}
function getpasswordstrength(a, b) {
	var c = 0;
	if (a == "" && b == "")
		return 0;
	if (b == a)
		return 1;
	if (a != "" && a.indexOf(b) != -1)
		c -= 15;
	if (a != "" && b.indexOf(a) != -1)
		c -= a.length;
	c += b.length;
	if (b.length > 0 && b.length <= 4)
		c += b.length;
	else if (b.length >= 5 && b.length <= 7)
		c += 6;
	else if (b.length >= 8 && b.length <= 15)
		c += 12;
	else if (b.length >= 16)
		c += 18;
	if (b.match(/[a-z]/))
		c += 1;
	if (b.match(/[A-Z]/))
		c += 5;
	if (b.match(/\d/))
		c += 5;
	if (b.match(/.*\d.*\d.*\d/))
		c += 5;
	if (b.match(/[!,@,#,$,%,^,&,*,?,_,~]/))
		c += 5;
	if (b.match(/.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~]/))
		c += 5;
	if (b.match(/(?=.*[a-z])(?=.*[A-Z])/))
		c += 2;
	if (b.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/))
		c += 2;
	if (b.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!,@,#,$,%,^,&,*,?,_,~])/))
		c += 2;
	var e = [], d = 0, g, k;
	for (g = 0; g < b.length; ++g) {
		k = b.charAt(g);
		if (typeof e[k] == "undefined") {
			e[k] = 1;
			++d
		}
	}
	if (d == 1)
		return 2;
	c *= 2;
	if (c < 0)
		c = 0;
	else if (c > 100)
		c = 100;
	return c
}
function geticonhtml(a, b) {
	return "<image src='" + geticonurl(a, b) + "'/>"
}
function geticonhtmlfromrecord(a) {
	return is_application(a) ? geticonhtml("a" + a.fiid) : geticonhtml(typeof a.fiid != "undefined" && a.fiid != "" ? a.fiid : a.aid, a.url == "http://sn")
}
function getNoteValue(a, b, c) {
	a += ":";
	if (!b)
		return null;
	b = "\n" + b;
	var e = b.indexOf("\n" + a);
	if (a == "NoteType:") {
		if (e != 0)
			return null
	} else if (e == -1)
		return null;
	e++;
	c = c ? "-1" : b.indexOf("\n", e);
	if (c == -1)
		c = b.length;
	return b.substring(e + a.length, c).replace(/^\s*/, "").replace(/\s*$/, "")
}
function geticonurlfromrecord(a) {
	return is_application(a) ? geticonurl("a" + a.fiid) : geticonurl(typeof a.fiid != "undefined" && a.fiid != "" ? a.fiid : a.aid, a.url == "http://sn")
}
function geticonurl(a, b) {
	var c = "data:image/gif;base64,R0lGODlhEAAQAIcAAAAAAExnf1BpgWR0iHZ6hHeBkX+GkYiOmpeaopucoaSlqqWmqrm9w7q+xL+/wry/xcXGyc3Oz9HS1NPU1tnZ2d/h4+Di5OLj5uPl5+Tk5OXm6O7u7+7v8O/w8e/w8vDw8fHx8vLy8/Pz8/Pz9PT09fX19fX29vb29vf39/f3+Pj4+Pj4+fn5+vr6+/v7/Pz8/P39/f7+/v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAAQABAAAAiQAAEIHEiw4MAFCBEmQCjBIIAFMiLK8CBjA4QIBiFu2Fgh4oYJDgpq5Chxw4KCCiqSlKigIAKVGyowYNDgAYGCB2BWsHABgwYDBQvA/CCiBAoVBQoOUNlBhAkVLV4MKCigIgenK1zAiCGgYICKIEhAhRExgFcZHEKcYEG27NkOI1K0aCvDLMEAePPqteuwr8CAADs=";
	if (a == "sn")
		return "data:image/gif;base64,R0lGODlhEAAQAPfBAFdCGCpgtyxity1kuS5kuS5luS9lujBlujBmujFmuzFnuzNpvIdhK4JmLjZvvzhxvzt2wTt2xKZoJjx4wT98xUB8xEKAxUKAxkWCxUWCxkeExkmFxEmIxkqIxkuIxWCFrUuJxUuJxkyJxr56Gk2LyE+Lx0+MyE+MyU+NyKqJQ8mFQWWU27yJTMKMSMeMSMWYSWWo0siZZLOfcNqYSduZS9CdRk+y99iaVFGy99mbUVW0+NOfZuChUdejY32y4tilWGG8+2K8/GK9/GO9+2C+/Ge9/GS+/GW++2i//W7C/duxhb+2ptW2etG3kNa5dprJ4+e+d+fAi8zGsMzGs+TJVcLLtpPU/8nNr5TV/+3KbefLd5XW//nHlPnJke3QeM3S2tDUvrjW9O7TebrW9fDTecjV4u7UffHUe9XWve7Vgc3W4fLWeu/SrPDStMHb+PbTrvXcXvXcX8Lc+MTd+fXfW/bdbPffY8Xf+ffhWsfg+sjg+ffiW8jg+8ng+/jiXcjh+8nh+8rh+sni+8vi+83j+83j/Onf0s7j+8/j/M/k/NDk+9Hk/PHjr9Xl/tPm/Nfm8tTm/NTm/fzgxPnjstPn/dXn/dbn/dbn/tfn/tbo/tfo/tjo/tzq9t7q9t7r9t/r9d/s9+Pt9+bw9+jx+Orx+Ory+uvy+Ozy9+zy+Ovz+uzz+e3z+O30+O30+e70+O/0+f/y4PD0+f32wv32xPH1+f/z5f33x/L2+vL3+/P3/PT3+/T4/PX5/Pf6/fj7/fj7//3+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEKAP8ALAAAAAAQABAAAAj+AP/9I2GioAkUJ0qAiCCw4YZTrlitmojq1CMfKxr+83ArDyBBfO64CfOryg8lNQSKoFXoEKFBeuSMYQSlTS02Lv6FoIVIUaJCgeZcSTMpyhtJO3TGcgSJ0iJCYMzMqpOlRwyBHV5hslQpEhoxtuLsWcPjg0AOrTZt0iRFiy04eM7QMJRBoAZVmTRNcSLLjh8yM8qUuiAQg6lLS5g0oULHSw41gHBREGhhVKMUsG6MeNHiS58/vSAIrCBKRwMuXVRIgIHDhg1eDgROCJUEAAMWMp5swWLliC4FAh98QlLkiBEjQoYAIRLE1wCBC0iB8tSJE6dUqUrl2gUsQMMDCRAMiD9goEABAgQECAwIADs=";
	if (a != null)
		if (typeof g_icons[a + ".gif"] != "undefined")
			c = "data:image/gif;base64," + g_icons[a + ".gif"];
		else if (typeof g_icons[a + ".ico"] != "undefined")
			c = "data:image/ico;base64," + g_icons[a + ".ico"];
		else if (b || typeof getBG().g_securenotes[a] != "undefined") {
			c = geticonsntemplate(a);
			if (c == null)
				c = "data:image/gif;base64,R0lGODlhEAAQAPfBAFdCGCpgtyxity1kuS5kuS5luS9lujBlujBmujFmuzFnuzNpvIdhK4JmLjZvvzhxvzt2wTt2xKZoJjx4wT98xUB8xEKAxUKAxkWCxUWCxkeExkmFxEmIxkqIxkuIxWCFrUuJxUuJxkyJxr56Gk2LyE+Lx0+MyE+MyU+NyKqJQ8mFQWWU27yJTMKMSMeMSMWYSWWo0siZZLOfcNqYSduZS9CdRk+y99iaVFGy99mbUVW0+NOfZuChUdejY32y4tilWGG8+2K8/GK9/GO9+2C+/Ge9/GS+/GW++2i//W7C/duxhb+2ptW2etG3kNa5dprJ4+e+d+fAi8zGsMzGs+TJVcLLtpPU/8nNr5TV/+3KbefLd5XW//nHlPnJke3QeM3S2tDUvrjW9O7TebrW9fDTecjV4u7UffHUe9XWve7Vgc3W4fLWeu/SrPDStMHb+PbTrvXcXvXcX8Lc+MTd+fXfW/bdbPffY8Xf+ffhWsfg+sjg+ffiW8jg+8ng+/jiXcjh+8nh+8rh+sni+8vi+83j+83j/Onf0s7j+8/j/M/k/NDk+9Hk/PHjr9Xl/tPm/Nfm8tTm/NTm/fzgxPnjstPn/dXn/dbn/dbn/tfn/tbo/tfo/tjo/tzq9t7q9t7r9t/r9d/s9+Pt9+bw9+jx+Orx+Ory+uvy+Ozy9+zy+Ovz+uzz+e3z+O30+O30+e70+O/0+f/y4PD0+f32wv32xPH1+f/z5f33x/L2+vL3+/P3/PT3+/T4/PX5/Pf6/fj7/fj7//3+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEKAP8ALAAAAAAQABAAAAj+AP/9I2GioAkUJ0qAiCCw4YZTrlitmojq1CMfKxr+83ArDyBBfO64CfOryg8lNQSKoFXoEKFBeuSMYQSlTS02Lv6FoIVIUaJCgeZcSTMpyhtJO3TGcgSJ0iJCYMzMqpOlRwyBHV5hslQpEhoxtuLsWcPjg0AOrTZt0iRFiy04eM7QMJRBoAZVmTRNcSLLjh8yM8qUuiAQg6lLS5g0oULHSw41gHBREGhhVKMUsG6MeNHiS58/vSAIrCBKRwMuXVRIgIHDhg1eDgROCJUEAAMWMp5swWLliC4FAh98QlLkiBEjQoYAIRLE1wCBC0iB8tSJE6dUqUrl2gUsQMMDCRAMiD9goEABAgQECAwIADs="
		}
	return c
}
function geticonsntemplate(a) {
	if (typeof getBG().g_securenotes[a] != "undefined")
		if (getBG().g_securenotes[a].extra.length < 512)
			if ((a = getNoteValue("NoteType", lpmdec_acct(getBG().g_securenotes[a].extra, true, getBG().g_securenotes[a], getBG().g_shares))) && typeof sntemplateicons[a] != "undefined")
				return sntemplateicons[a];
	return null
}
function getcount(a) {
	var b = 0, c;
	for (c in a)
		b++;
	return b
}
function getusernamefromacct(a) {
	if (is_application(a)) {
		for ( var b in a.fields) {
			var c = a.fields[b];
			if (c.type == "" && c.value != "")
				return getBG().lpmdec_acct(c.value, true, a, getBG().g_shares)
		}
		return ""
	}
	if (a.save_all) {
		for (c in a.fields)
			if (("text" == a.fields[c].type || "email" == a.fields[c].type) && a.fields[c].value != "")
				return getBG().lpmdec_acct(a.fields[c].value, true, a, getBG().g_shares);
		return ""
	} else {
		if (typeof a.url != "undefined" && a.url == "http://sn") {
			b = getBG().lpmdec_acct(a.extra, true, a, getBG().g_shares);
			c = getNoteValue("NoteType", b);
			if (c == "Server" || c == "Email Account" || c == "Database")
				return getNoteValue("Username", b)
		}
		return typeof a.unencryptedUsername != "undefined" ? a.unencryptedUsername : ""
	}
}
function getpasswordfromacct(a) {
	if (is_application(a)) {
		for ( var b in a.fields) {
			var c = a.fields[b];
			if (c.type == "password" && c.value != "")
				return getBG().lpmdec_acct(c.value, true, a, getBG().g_shares)
		}
		return ""
	}
	if (a.save_all) {
		for (c in a.fields)
			if (a.fields[c].type == "password" && a.fields[c].value != "")
				return getBG().lpmdec_acct(a.fields[c].value, true, a, getBG().g_shares);
		return ""
	} else {
		if (typeof a.url != "undefined" && a.url == "http://sn") {
			b = getBG().lpmdec_acct(a.extra, true, a, getBG().g_shares);
			c = getNoteValue("NoteType", b);
			if (c == "Server" || c == "Email Account" || c == "Database")
				return getNoteValue("Password", b)
		}
		return typeof a.password != "undefined" ? getBG().lpmdec_acct(a.password, true, a, getBG().g_shares) : ""
	}
}
function geturlfromacct(a) {
	if (is_application(a) || typeof a.url == "undefined" || a.url == "http://sn")
		return "";
	return a.url
}
function createNewAcct() {
	var a = [];
	a.aid = "";
	a.name = "";
	a.group = "";
	a.url = "";
	a.tld = "";
	a.extra = "";
	a.fav = "0";
	a.sharedfromuid = "";
	a.username = "";
	a.unencryptedUsername = "";
	a.password = "";
	a.pwprotect = 0;
	a.genpw = 0;
	a.sn = 0;
	a.last_touch = lp_get_gmt_timestamp();
	a.autologin = 0;
	a.never_autofill = 0;
	a.realm_data = "";
	a.fiid = "";
	a.custom_js = "";
	a.submit_id = "";
	a.captcha_id = "";
	a.urid = "0";
	a.basic_auth = "0";
	a.method = "";
	a.action = "";
	a.individualshare = false;
	a.fields = [];
	return a
}
function fix_fields(a) {
	if (typeof a.fields != "undefined" && typeof a.fields.length == "undefined") {
		var b = [], c;
		for (c in a.fields)
			b[b.length] = a.fields[c];
		a.fields = b
	}
	return a
}
var g_console_log = "";
function truncatelog() {
	if (g_console_log.length > 2E4)
		g_console_log = g_console_log.substring(g_console_log.length - 2E4)
}
function console_log(a) {
	if (g_isopera)
		window.opera.postError(a);
	else {
		console.log(a);
		if (g_issafari) {
			truncatelog();
			g_console_log += a + "\n"
		}
	}
}
function console_warn(a) {
	g_isopera ? window.opera.postError(a) : console.warn(a)
}
function console_error(a) {
	if (g_isopera)
		window.opera.postError(a);
	else {
		console.error(a);
		if (g_issafari) {
			truncatelog();
			g_console_log += a + "\n"
		}
	}
}
function dispatch_message(a, b) {
	if (g_issafari) {
		if (typeof safari.self != "undefined" || typeof safari.self.tab != "undefined")
			typeof safari.self.tab.dispatchMessage != "undefined" && safari.self.tab.dispatchMessage(a, b)
	} else if (g_isopera) {
		b.messagetype = a;
		opera.extension.postMessage(b)
	}
}
function get_key_iterations(a) {
	a = SHA256(a);
	var b = a + "_key_iter";
	if (typeof localStorage != "undefined" && localStorage.getItem(b) != null)
		return localStorage.getItem(b);
	if (typeof localStorage != "undefined" && (localStorage.getItem(a + "_lt.cac") != null || localStorage.getItem(a + ".savedtree") != null)) {
		localStorage.setItem(a + "_key_iter", 1);
		return 1
	}
	return DEFAULT_KEY_ITERATIONS
}
function ofja(a) {
	return ofa(es(a))
}
function ofa(a) {
	a = a.toString();
	var b = a.length, c = "", e = 0, d;
	for (d = 0; d < b; ++d) {
		e = a.charCodeAt(d);
		if (e < 48 || e > 57 && e < 65 || e > 90 && e < 97 || e > 122 && e < 256) {
			e = e.toString(16);
			if (e.length != 2)
				e = "0" + e;
			c += "&#x" + e + ";"
		} else
			c += a.charAt(d)
	}
	return c
}
function is_application(a) {
	return typeof a == "string" ? a.indexOf("app") == 0 : a && typeof a.appaid != "undefined"
}
function get_appaid(a) {
	return a.indexOf("app") == 0 ? a.substring(3) : a
}
function get_record_id(a) {
	return is_application(a) ? "app" + a.appaid : a.aid
}
function get_record(a) {
	return is_application(a) ? get_application(a) : typeof g_sites != "undefined" && typeof g_sites[a] != "undefined" ? g_sites[a] : typeof g_securenotes != "undefined" && typeof g_securenotes[a] != "undefined" ? g_securenotes[a] : typeof getBG().g_sites[a] != "undefined" ? getBG().g_sites[a] : typeof getBG().g_securenotes[a] != "undefined" ? getBG().g_securenotes[a] : null
}
function get_application(a) {
	if (is_application(a))
		a = get_appaid(a);
	return typeof g_applications != "undefined" && typeof g_applications[a] != "undefined" ? g_applications[a] : getBG().g_applications[a]
}
function search_results(a, b) {
	var c = [], e;
	for (e in getBG().g_sites)
		if (getBG().check_ident_aid(e)) {
			var d = getBG().g_sites[e];
			if (d.url != "http://group")
				if (d.url.toLowerCase().indexOf(a) != -1 || d.name.toLowerCase().indexOf(a) != -1 || d.group.toLowerCase().indexOf(a) != -1 || d.unencryptedUsername.toLowerCase().indexOf(a) != -1)
					c[c.length] = d;
				else if (b && d.extra.length > 0 && d.url != "http://group") {
					var g = getBG().lpmdec_acct(d.extra, true, d, getBG().g_shares);
					if (g.toLowerCase().indexOf(a) != -1)
						c[c.length] = d
				}
		}
	for (e in getBG().g_securenotes)
		if (getBG().check_ident_aid(e)) {
			d = getBG().g_securenotes[e];
			if (d.name.toLowerCase().indexOf(a) != -1 || d.group.toLowerCase().indexOf(a) != -1)
				c[c.length] = d;
			else if (b && d.extra.length > 0 && d.url != "http://group") {
				g = getBG().lpmdec_acct(d.extra, true, d, getBG().g_shares);
				if (g.toLowerCase().indexOf(a) != -1)
					c[c.length] = d
			}
		}
	for (e in getBG().g_applications)
		if (getBG().check_ident_appaid(e)) {
			d = getBG().g_applications[e];
			if (d.appname.toLowerCase().indexOf(a) != -1 || d.name.toLowerCase().indexOf(a) != -1 || d.group.toLowerCase().indexOf(a) != -1 || getusernamefromacct(d).toLowerCase().indexOf(a) != -1)
				c[c.length] = d;
			else if (b && d.extra.length > 0 && (typeof d.url == "undefined" || d.url != "http://group")) {
				g = getBG().lpmdec_acct(d.extra, true, d, getBG().g_shares);
				if (g.toLowerCase().indexOf(a) != -1)
					c[c.length] = d
			}
		}
	return c
}
function mostRecent() {
	return window
}
function currentWindow() {
	return window
}
function en(a) {
	return encodeURIComponent(a)
}
function lpprefsHasUserValue(a, b) {
	return b
}
function lpprefsGetBoolPref(a, b) {
	return b
}
function lpprefsGetIntPref(a, b) {
	return b
}
function lpGetAccounts() {
	get_accts()
}
function elapsedTime(a) {
	if (typeof a == "undefined" || a < 31536E3)
		return gs("Never");
	a = lp_get_gmt_timestamp() - a;
	if (a < 0)
		return gs("just now");
	if (a < 60) {
		a = a;
		return a + " " + (a == 1 ? gs("second") : gs("seconds")) + " " + gs("ago")
	}
	if (a < 3600) {
		a = Math.floor(a / 60);
		return a + " " + (a == 1 ? gs("minute") : gs("minutes")) + " " + gs("ago")
	}
	if (a < 86400) {
		a = Math.floor(a / 60 / 60);
		return a + " " + (a == 1 ? gs("hour") : gs("hours")) + " " + gs("ago")
	}
	if (a < 604800) {
		a = Math.floor(a / 60 / 60 / 24);
		return a + " " + (a == 1 ? gs("day") : gs("days")) + " " + gs("ago")
	}
	if (a < 2678400) {
		a = Math.floor(a / 60 / 60 / 24 / 7);
		return a + " " + (a == 1 ? gs("week") : gs("weeks")) + " " + gs("ago")
	}
	if (a < 31536E3) {
		a = Math.floor(a / 60 / 60 / 24 / 31);
		return a + " " + (a == 1 ? gs("month") : gs("months")) + " " + gs("ago")
	}
	a = Math.floor(a / 60 / 60 / 24 / 365);
	return a + " " + (a == 1 ? gs("year") : gs("years")) + " " + gs("ago")
}
function is_opera_12() {
	try {
		if (g_isopera) {
			var a = navigator.userAgent.match(/ Version\/([0-9.]+)/);
			if (a && parseFloat(a[1]) >= 12)
				return true
		}
	} catch (b) {
	}
	return false
}
function window_close(a) {
	is_opera_12() ? getBG().closecurrenttab(a) : window.close()
}
var dbgts = (new Date).getTime();
function lpdbg(a, b) {
	typeof g_isdebug != "undefined" && g_isdebug && console_log(Math.floor(((new Date).getTime() - dbgts) / 1E3) + " : " + a + " : " + b)
}
function lplog(a) {
	console_log(a)
}
function convert_object_to_array(a) {
	var b = [], c;
	for (c in a)
		b[b.length] = a[c];
	return b
}
function getQueryVariable(a) {
	for ( var b = window.location.search.substring(1).split("&"), c = 0; c < b.length; c++) {
		var e = b[c].split("=");
		if (e[0] == a)
			return decodeURIComponent(e[1])
	}
	return ""
}
var g_port = null, g_foundmanual = false, LP_last_form = null, g_docnum = null, lpsavedform = null, lpsavedformfields = [], lpsharedpasswordfills = [], g_fillaid = null, g_setup_hotkey_handler = false, curr_notification_type = "", lpgenpassforms = [], lpgenpasscurrentpwfields = [], g_sites = [], g_formfills = [], g_ischrome = typeof chrome != "undefined" && typeof chrome.extension != "undefined", g_issafari = typeof safari != "undefined" && typeof safari.self != "undefined", g_isopera = typeof opera != "undefined" && typeof opera.extension != "undefined", g_menuopen = false, experimentaloverlay = g_ischrome || g_issafari, urlprefix = null, disable_check_form_fill = !experimentaloverlay, g_mouseX = 0, g_mouseY = 0, g_initiallysetupff = false, g_notificationmax = 200, g_notificationmin = 27, g_contextheight = 190, g_contextwidth = 230, g_iframerand = "", g_contextrand = "", g_last_launch = [], ELLIPSIS_CODE = "&#133;";
function message_handler(a) {
	if (g_issafari)
		a.name == "message" && receiveBG(a.message);
	else
		g_isopera && a.data.messagetype == "message" && receiveBG(a.data)
}
function send_focus() {
	if (g_issafari)
		safari.self.tab.dispatchMessage("focus", {
			url : punycode.URLToASCII(document.location.href)
		});
	else
		g_isopera && opera.extension.postMessage({
		messagetype : "focus",
		url : punycode.URLToASCII(document.location.href)
		})
}
function onLoad() {
	if (g_ischrome) {
		g_port = chrome.extension.connect({
			name : punycode.URLToASCII(document.location.href)
		});
		g_port.onMessage.addListener(receiveBG);
		g_port.onDisconnect.addListener(function(a) {
			receiveBG(null, a, 1)
		})
	} else if (g_issafari) {
		safari.self.addEventListener("message", message_handler, false);
		g_docnum = Math.floor(Math.random() * 1E8);
		setTimeout(function() {
			safari.self.tab.dispatchMessage("connect", {
			name : punycode.URLToASCII(document.location.href),
			docnum : g_docnum,
			top : window == lpgettop()
			})
		}, 150);
		if (window == lpgettop()) {
			send_focus();
			window.addEventListener("focus", function() {
				send_focus()
			}, false)
		}
	} else if (g_isopera) {
		opera.extension.onmessage = message_handler;
		g_docnum = Math.floor(Math.random() * 1E8);
		opera.extension.postMessage({
		messagetype : "connect",
		name : punycode.URLToASCII(document.location.href),
		docnum : g_docnum,
		topurl : lpgettopurl()
		})
	}
}
var g_lp_hotkeys = [ "generateHk", "recheckHk", "searchHk", "nextHk", "prevHk", "homeHk", "submitHk", "saveallHk", "logoffHk", "defaultffidHk", "openpopoverHk" ], g_hotkey_data = [];
function handle_hotkey(a) {
	var b = a.keyCode != 0 ? a.keyCode : a.charCode;
	if (!(b < 32)) {
		var c = "";
		c += a.ctrlKey ? "control" : "";
		c += a.metaKey ? (c != "" ? " " : "") + "meta" : "";
		c += a.altKey ? (c != "" ? " " : "") + "alt" : "";
		c += a.shiftKey ? (c != "" ? " " : "") + "shift" : "";
		if (!(c == "" || c == "shift"))
			for (a = 0; a < g_lp_hotkeys.length; a++) {
				var e = g_lp_hotkeys[a];
				if (g_hotkey_data[e + "KeyCode"] == b && g_hotkey_data[e + "Mods"] == c) {
					sendBG({
					cmd : "runhotkey",
					hotkey : e
					});
					break
				}
			}
	}
}
function disconnectBG() {
	if (g_port) {
		g_port.disconnect();
		g_port = null
	}
}
function sendBG(a) {
	a.docnum = g_docnum;
	if (g_ischrome)
		if (g_port)
			g_port.postMessage(a);
		else
			a.cmd != "rebuildcontext" && L("CS -> BG : FAILED " + a.cmd);
	else if (g_issafari)
		safari.self.tab.dispatchMessage("message", a);
	else if (g_isopera) {
		a.messagetype = "message";
		a.topurl = lpgettopurl();
		opera.extension.postMessage(a)
	}
}
var g_form = null, g_fillreqdocs = [];
function receiveBG(a, b, c) {
	if (!((g_issafari || g_isopera) && typeof a.docnum != "undefined" && a.docnum != g_docnum))
		if (c) {
			L("BG -> CS : DISCONNECT");
			g_port = null
		} else if (typeof a.cmd == "undefined")
			L("BG -> CS : INVALIDMSG");
		else {
			urlprefix = a.urlprefix;
			switch (a.cmd) {
			case "setdocnum":
				g_docnum = a.docnum;
				if (typeof a.ff != "undefined") {
					setupffoverrides(a);
					g_initiallysetupff = true
				}
				sendBG({
				cmd : "rebuildcontextonload",
				url : punycode.URLToASCII(document.location.href)
				});
				sendBG({
				cmd : "getprefs",
				url : punycode.URLToASCII(document.location.href),
				username_val : get_username_val(document)
				});
				evalScriptsInFrame(window, document);
				break;
			case "rsadecrypt":
				g_form.eventtype.value = a.rc;
				g_form.eventdata4.value = a.sharekeyhex;
				break;
			case "rsaencryptmultiple":
				g_form.eventtype.value = a.rc;
				g_form.eventdata4.value = a.dataout;
				break;
			case "ipcgotdata":
				if (g_ipctarget) {
					g_ipctarget.setAttribute("msg", "gotdata");
					g_ipctarget.setAttribute("g_username", a.username);
					g_ipctarget.setAttribute("g_local_key", atob(a.key));
					g_ipctarget.setAttribute("g_key_iterations", a.iterations);
					a = g_ipctarget.ownerDocument.createEvent("HTMLEvents");
					a.initEvent("message", true, false);
					g_ipctarget.dispatchEvent(a)
				}
				break;
			case "plug2web":
				g_form.eventdata1.value = a.username;
				g_form.eventdata2.value = a.key;
				g_form.eventdata3.value = a.version;
				g_form.eventdata4.value = a.identity;
				g_form.eventdata5.value = a.hash;
				setTimeout(function() {
					evaluntilfindmanual()
				}, 500);
				break;
			case "getversion":
				g_form.eventdata1.value = a.version;
				g_form.eventdata2.value = a.builddate;
				g_form.eventdata3.value = a.versionpre;
				g_form.eventdata4.value = "cr";
				break;
			case "fillfield":
				fillfield(a);
				break;
			case "fillbest":
				fillbest(a);
				break;
			case "run_custom_js":
				if (a.custom_js != "") {
					b = a.docid ? g_fillreqdocs[a.docid] : document;
					run_custom_js(b, lpPrepareCustomJS(a.custom_js, a.username, a.password, a.loc + "", a.onlyfill, b))
				}
				break;
			case "submit":
				submit(a);
				break;
			case "fillform":
				fillform(a);
				break;
			case "clearforms":
				lpClearForms(null, document, 1, window);
				break;
			case "saveall":
				saveall();
				break;
			case "setprefs":
				lpdisableHighlightField = a.highlightFields == 0;
				lpwarninsecureforms = a.warninsecureforms;
				lpdontfillautocompleteoff = a.dontfillautocompleteoff;
				lpdonotoverwritefilledfields = a.donotoverwritefilledfields;
				lpOfferGeneratePasswd = a.showGenerateNotifications;
				lpShowFormFillNotifications = a.showFormFillNotifications;
				lpNotificationsAfterClick = g_initiallysetupff ? a.showNotificationsAfterClick : 1;
				alwayschooseprofilecc = a.alwayschooseprofilecc;
				b = false;
				for (c = 0; c < g_lp_hotkeys.length; c++) {
					var e = g_lp_hotkeys[c];
					if (a[e + "KeyCode"] != 0)
						b = true;
					g_hotkey_data[e + "KeyCode"] = a[e + "KeyCode"];
					g_hotkey_data[e + "Mods"] = a[e + "Mods"]
				}
				if (b && !g_setup_hotkey_handler) {
					g_setup_hotkey_handler = true;
					window.addEventListener("keydown", function(d) {
						handle_hotkey(d)
					}, false)
				}
				break;
			case "setuuid":
				g_form.eventdata1.value = a.uuid;
				break;
			case "recover":
				g_form.eventdata2.value = a.otp;
				break;
			case "recheck":
				evalScriptsInFrame(window, document, true);
				break;
			case "loadurl":
				document.location.href = a.url;
				break;
			case "setupmultifactor":
				g_form.eventdata3.value = a.result;
				break;
			case "setupsinglefactor":
				g_form.eventdata4.value = a.result;
				break;
			case "checkmultifactorsupport":
				g_form.eventdata4.value = a.type;
				g_form.eventdata3.value = a.result;
				break;
			case "verifymultifactor":
				g_form.eventdata3.value = a.eventdata3;
				g_form.eventdata2.value = a.eventdata2;
				break;
			case "multifactorauth":
				g_form.eventdata5.value = a.multifactorresponse;
				g_form.eventdata3.value = a.result;
				break;
			case "multifactorreprompt":
				g_form.eventdata3.value = a.result;
				break;
			case "showfillnotification":
				lpshownotification("fill", a);
				break;
			case "showaddnotification":
				lpshownotification("add", a);
				break;
			case "showchangenotification":
				lpshownotification("change", a);
				break;
			case "showerrornotification":
				lpshownotification("error", a);
				break;
			case "showbasicauthnotification":
				lpshownotification("basicauth", a);
				break;
			case "closenotification":
				lpclosenotification(a.includeerror, a.excludeother);
				break;
			case "checkgenpwfillforms":
				checkgenpwfillforms(a);
				break;
			case "fillcurrent":
				fillcurrent(a);
				break;
			case "showoverlay":
				showoverlay(a);
				break;
			case "slidedownoverlay":
				slidedownoverlay(a);
				break;
			case "slideupoverlay":
				slideupoverlay(a);
				break;
			case "hideoverlay":
				hideoverlay(a);
				break;
			case "hidecontext":
				hidecontext();
				break;
			case "checkgeneratepassword":
				lpCheckGeneratePassword(null, document, true, window) && sendBG({
					cmd : "generatepasswordfound"
				});
				break;
			case "populategeneratedpassword":
				a.url == punycode.URLToASCII(document.location.href) && populategeneratedpassword(a.url, a.password, a.nofill);
				break;
			case "gotnotificationdata":
				break;
			case "gotimportdata":
				document.getElementById("source").value = a.source;
				document.getElementById("t").value = a.data;
				document.getElementById("b64").value = "1";
				document.getElementById("utf8").value = "1";
				document.getElementById("encryptandstore").click();
				break;
			case "showcontext":
				lpshownotification("context", a);
				break;
			default:
				L("BG -> CS : INVALIDMSG")
			}
		}
}
function hidecontext() {
	g_contextrand != "" && document.getElementById("lpiframeoverlay" + g_contextrand) && document.body.removeChild(document.getElementById("lpiframeoverlay" + g_contextrand))
}
document.addEventListener("click", function(a) {
	if (g_isopera && !experimentaloverlay)
		if (!chk_should_close_exttable(a))
			return;
	g_menuopen && slideupoverlay();
	hidecontext()
}, false);
var g_scrollthread = null, g_scrolloffset = 0, g_animatethread = null;
function smoothScroll() {
	document.getElementById("lpiframeoverlay" + g_iframerand).style.visibility = "hidden";
	g_scrolloffset = 30;
	if (g_scrollthread) {
		clearTimeout(g_scrollthread);
		clearTimeout(g_animatethread)
	}
	g_scrollthread = setTimeout(function() {
		if (g_scrolloffset != 30)
			smoothScroll();
		else {
			document.getElementById("lpiframeoverlay" + g_iframerand).style.visibility = "visible";
			g_animatethread = setInterval(function() {
				document.getElementById("lpiframeoverlay" + g_iframerand).style.top = document.body.scrollTop - g_scrolloffset + "px";
				g_scrolloffset--;
				g_scrolloffset <= 0 && clearTimeout(g_animatethread)
			}, 1)
		}
	}, 400)
}
if (g_ischrome) {
	document.addEventListener("scroll", function() {
		document.getElementById("lpiframeoverlay" + g_iframerand) && smoothScroll()
	}, false);
	window.addEventListener("focus", function() {
		sendBG({
		cmd : "rebuildcontext",
		url : punycode.URLToASCII(document.location.href)
		})
	})
}
if (g_issafari) {
	document.addEventListener("mousemove", function(a) {
		g_mouseX = a.pageX;
		g_mouseY = a.pageY
	}, false);
	document.addEventListener("contextmenu", function() {
		hidecontext()
	}, false)
}
function overlayresize() {
	if (document.getElementById("lpiframeoverlay" + g_iframerand)) {
		var a = window.innerWidth;
		document.getElementById("lpiframeoverlay" + g_iframerand).style.width = a + "px";
		document.getElementById("lpiframe" + g_iframerand).style.width = a + "px"
	}
}
function showoverlay(a, b) {
	var c = document.body;
	if (c) {
		var e = "", d = h = t = l = 0;
		if (b.indexOf("&context") != 0) {
			e = g_iframerand = Math.floor(Math.random() * 1E8);
			d = window.innerWidth;
			h = g_notificationmin;
			l = 0;
			t = document.body.scrollTop;
			var g = document.createElement("div");
			g.id = "lptopspacer" + g_iframerand;
			g.style.height = g_notificationmin + "px";
			c.insertBefore(g, c.firstChild);
			window.addEventListener("resize", overlayresize, false)
		} else {
			hidecontext();
			e = g_contextrand = Math.floor(Math.random() * 1E8);
			d = g_contextwidth;
			h = g_contextheight;
			t = g_mouseY;
			l = g_mouseX;
			g = window.innerWidth;
			var k = window.innerHeight + document.body.scrollTop;
			if (t + g_contextheight > k)
				t -= t + g_contextheight - k + 10;
			if (l + g_contextwidth > g)
				l -= l + g_contextwidth - g + 20
		}
		g = document.createElement("div");
		g.id = "lpiframeoverlay" + e;
		g.style.top = t + "px";
		g.style.left = l + "px";
		g.style.height = "1px";
		g.style.width = d + "px";
		g.style.position = "absolute";
		g.style.backgroundColor = "black";
		g.style.zIndex = "1000000099";
		k = window.getComputedStyle(c, null);
		var n = parseInt(k.width) + parseInt(k.marginLeft) + parseInt(k.marginRight);
		if (k.position == "relative") {
			var o = document.body.getBoundingClientRect(), f = 0;
			if (n < d && o.left > parseInt(k["margin-left"]) + parseInt(k["padding-left"]) + parseInt(k["border-left-width"]))
				f = (d - n) / 2;
			else if (parseInt(k["margin-left"]) > 0)
				f = parseInt(k["margin-left"]);
			g.style.marginLeft = -1 * f + "px"
		}
		c.appendChild(g);
		c = document.createElement("iframe");
		c.id = "lpiframe" + e;
		c.src = urlprefix + "overlay.html?" + b;
		c.style.height = h + "px";
		c.style.width = d + "px";
		c.style.border = "0px";
		g.appendChild(c)
	}
}
function slidedownoverlay(a) {
	var b = document.getElementById("lpiframe" + g_iframerand);
	if (b) {
		var c = parseInt(b.style.height);
		g_menuopen = true;
		if (c < g_notificationmax) {
			b.style.height = c + (g_notificationmax - c > 10 ? 10 : g_notificationmax - c) + "px";
			setTimeout(function() {
				slidedownoverlay(a)
			}, 5)
		}
	}
}
function slideupoverlay(a) {
	var b = document.getElementById("lpiframe" + g_iframerand);
	if (b) {
		var c = parseInt(b.style.height);
		g_menuopen = false;
		if (c > g_notificationmin) {
			b.style.height = c - (c - g_notificationmin > 10 ? 10 : c - g_notificationmin) + "px";
			setTimeout(function() {
				slideupoverlay(a)
			}, 5)
		}
	}
}
function hideoverlay() {
	if (document.getElementById("lpiframeoverlay" + g_iframerand)) {
		document.body.removeChild(document.getElementById("lpiframeoverlay" + g_iframerand));
		document.body.removeChild(document.getElementById("lptopspacer" + g_iframerand));
		window.removeEventListener("resize", overlayresize, false)
	}
}
function fillcurrent(a) {
	if (typeof lpgenpasscurrentpwfields[punycode.URLToASCII(document.location.href)] != "undefined" && lpgenpasscurrentpwfields[punycode.URLToASCII(document.location.href)])
		lpgenpasscurrentpwfields[punycode.URLToASCII(document.location.href)].value = a.password
}
function setupffoverrides(a) {
	if (typeof g_ff == "undefined" || g_ff == null) {
		g_ff = a.ff;
		if (g_issafari || g_isopera)
			eval(a.language_data);
		if (!(typeof g_ff == "undefined" || g_ff == null)) {
			a = LPJSON.parse(g_ff);
			for ( var b in a)
				if (a.hasOwnProperty(b))
					for ( var c in a[b])
						if (a[b].hasOwnProperty(c) && c.indexOf("ff_") == 0)
							lpgscache[b + c] = a[b][c]
		}
	}
}
function checkgenpwfillforms(a) {
	setupffoverrides(a);
	var b = null;
	if (g_sites.length == 0)
		g_sites = LPJSON.parse(a.sites);
	if (g_formfills.length == 0)
		g_formfills = LPJSON.parse(a.formfills);
	a.nevergenerate || (b = lpCheckGeneratePassword(null, document, false, window));
	experimentaloverlay && !b && !a.neverformfill && lpCheckFormFill(null, document, false, false, null, 1, window)
}
function evalScriptsInFrame(a, b, c) {
	try {
		for ( var e = 0; b.frames && e < b.frames.length; e++)
			evalScriptsInFrame(b.frames[e], b.frames[e].document, c)
	} catch (d) {
	}
	punycode.URLToASCII(b.location.href);
	var g = b.readyState;
	if (c || g == "loaded" || g == "complete") {
		if (b.body && typeof b.body._lpcrdone == "undefined") {
			b.body._lpcrdone = 1;
			hookAllFormSubmits(b)
		} else if (!c)
			return;
		var k = b.getElementsByTagName("input"), n = 0;
		for (e = 0; e < k.length; e++)
			k[e].type == "password" && n++;
		c = c ? 1 : 0;
		sendBG({
		cmd : "fill",
		url : punycode.URLToASCII(b.location.href),
		docid : g_fillreqdocs.length,
		force : c,
		numpass : n
		});
		g_fillreqdocs[g_fillreqdocs.length] = b;
		g != "complete" && window.addEventListener("load", function() {
			sendBG({
			cmd : "fill",
			url : punycode.URLToASCII(b.location.href),
			docid : g_fillreqdocs.length - 1,
			force : c,
			numpass : n
			})
		}, false)
	} else
		setTimeout(function() {
			evalScriptsInFrame(a, b, 0)
		}, 100)
}
function hookAllFormSubmits(a) {
	try {
		if (lp_gettld_url(punycode.URLToASCII(a.location.href)) != "acidtests.org" && a.getElementById("hiddenlpsubmitdiv") == null && a.forms.length > 0) {
			var b = a.createElement("div");
			b.style.display = "none";
			b.id = "hiddenlpsubmitdiv";
			a.body && a.body.appendChild(b);
			var c = "for(var lastpass_iter=0; lastpass_iter < document.forms.length; lastpass_iter++){ var lastpass_f = document.forms[lastpass_iter]; ";
			if (g_isopera)
				c += "if (typeof(lastpass_f.id) != 'undefined' && lastpass_f.id == 'dl-form') { continue; } ";
			c += 'if(typeof(lastpass_f.lpsubmitorig2)=="undefined"){ lastpass_f.lpsubmitorig2 = lastpass_f.submit; lastpass_f.submit = function(){ var form=this; var customEvent = document.createEvent("Event"); customEvent.initEvent("lpCustomEvent", true, true); var d = document.getElementById("hiddenlpsubmitdiv"); for(var i = 0; i < document.forms.length; i++){ if(document.forms[i]==form){ d.innerText=i; } } d.dispatchEvent(customEvent); form.lpsubmitorig2(); } } }';
			run_custom_js(a, c);
			b.addEventListener("lpCustomEvent", function() {
				handle_form_submit(a, a.forms[parseInt(b.innerText)])
			})
		}
		for (c = 0; c < a.forms.length; c++) {
			var e = a.forms[c];
			if (typeof e.lpsubmitorig == "undefined") {
				if (e.name == "lpmanualform")
					g_foundmanual = true;
				e.lpsubmitorig = true;
				e.addEventListener("submit", function(o) {
					handle_form_submit(a, o.target)
				}, false);
				try {
					if (typeof e.elements != "function" || g_issafari)
						for ( var d = 0; d < e.elements.length; d++) {
							var g = e.elements[d];
							if ("text" == g.type || "email" == g.type || "password" == g.type) {
								g.addEventListener("change", lpfieldchange, false);
								g_initiallysetupff || g.addEventListener("focus", lpfieldfocus, false)
							}
						}
				} catch (k) {
				}
			}
		}
	} catch (n) {
	}
}
function handle_form_submit(a, b) {
	try {
		if (b.name == "lpwebsiteeventform")
			lpwebsiteevent(a, b);
		else if (b.name == "lpmanualform")
			lpmanuallogin(a, b);
		else {
			var c = LP_get_form_save(b);
			if (c == null)
				return false;
			if (typeof a.LPlpsaveforminfo != "undefined" && typeof SAVEALLFORMSUBMITS == "undefined")
				lpupdatefields(a, c);
			else
				typeof a.LPlpsaveforminfoaddurid != "undefined" ? lpaddurid(a, c) : lpformsubmit(a, c)
		}
	} catch (e) {
	}
}
function lpupdatefields(a, b) {
	sendBG({
	cmd : "updatefields",
	url : punycode.URLToASCII(a.location.href),
	formdata : b,
	aid : a.LPlpsaveforminfo
	})
}
function lpaddurid(a, b) {
	sendBG({
	cmd : "addurid",
	url : punycode.URLToASCII(a.location.href),
	formdata : b,
	aid : a.LPlpsaveforminfoaddurid
	})
}
function lpformsubmit(a, b) {
	sendBG({
	cmd : "save",
	url : punycode.URLToASCII(a.location.href),
	formdata : b
	})
}
function lpmanuallogin(a, b) {
	sendBG({
	cmd : "launchautologin",
	url : punycode.URLToASCII(a.location.href),
	aid : b.aid.value
	})
}
function lpwebsiteevent(a, b) {
	sendBG({
	cmd : "log",
	msg : "Event: " + b.eventtype.value
	});
	if (b.eventtype.value == "keyplug2web") {
		g_form = b;
		sendBG({
		cmd : "plug2web",
		url : punycode.URLToASCII(a.location.href),
		username : b.eventdata1.value
		})
	} else if (b.eventtype.value == "getversion") {
		g_form = b;
		sendBG({
			cmd : "getversion"
		})
	} else if (b.eventtype.value == "keyweb2plug")
		sendBG({
		cmd : "web2plug",
		url : punycode.URLToASCII(a.location.href),
		key : b.eventdata1.value,
		username : b.eventdata2.value,
		rsa : b.eventdata3.value
		});
	else if (b.eventtype.value == "logoff")
		sendBG({
		cmd : "logoff",
		url : punycode.URLToASCII(a.location.href)
		});
	else if (b.eventtype.value == "login") {
		setTimeout(function() {
			evaluntilfindmanual(true)
		}, 1E3);
		sendBG({
		cmd : "login",
		url : punycode.URLToASCII(a.location.href),
		wxusername : b.eventdata1.value,
		keyhex : b.eventdata2.value,
		wxhash : b.eventdata3.value,
		wxsessid : b.eventdata5.value
		})
	} else if (b.eventtype.value == "rsadecrypt") {
		g_form = b;
		sendBG({
		cmd : "rsadecrypt",
		url : punycode.URLToASCII(a.location.href),
		sharerpublickeyhex : b.eventdata1.value,
		sharekeyenchexsig : b.eventdata2.value,
		sharekeyenchex : b.eventdata3.value
		})
	} else if (b.eventtype.value == "rsaencryptmultiple") {
		g_form = b;
		sendBG({
		cmd : "rsaencryptmultiple",
		url : punycode.URLToASCII(a.location.href),
		data : b.eventdata1.value
		})
	} else if (b.eventtype.value == "clearcache")
		sendBG({
		cmd : "clearcache",
		url : punycode.URLToASCII(a.location.href)
		});
	else if (b.eventtype.value == "getimportdata")
		sendBG({
		cmd : "getimportdata",
		url : punycode.URLToASCII(a.location.href)
		});
	else if (b.eventtype.value == "recover") {
		g_form = b;
		sendBG({
		cmd : "recover",
		url : punycode.URLToASCII(a.location.href),
		username : b.eventdata1.value
		})
	} else if (b.eventtype.value == "recheck")
		evalScriptsInFrame(window, document, true);
	else if (b.eventtype.value == "refresh")
		sendBG({
		cmd : "refresh",
		url : punycode.URLToASCII(a.location.href),
		from : b.eventdata1.value,
		type : b.eventdata2.value
		});
	else if (b.eventtype.value == "switchidentity")
		sendBG({
		cmd : "switchidentity",
		url : punycode.URLToASCII(a.location.href),
		iid : b.eventdata1.value
		});
	else if (b.eventtype.value == "getuuid") {
		g_form = b;
		sendBG({
			cmd : "getuuid"
		})
	} else if (b.eventtype.value == "setupmultifactor") {
		b.eventdata3.value = "working";
		g_form = b;
		sendBG({
		cmd : "setupmultifactor",
		type : b.eventdata1.value,
		username : b.eventdata2.value
		})
	} else if (b.eventtype.value == "setupsinglefactor") {
		if (b.eventdata5.value != "1")
			b.eventdata4.value = "working";
		g_form = b;
		sendBG({
		cmd : "setupsinglefactor",
		type : b.eventdata1.value,
		username : b.eventdata2.value,
		password : b.eventdata3.value,
		silent : b.eventdata5.value
		})
	} else if (b.eventtype.value == "checkmultifactorsupport") {
		g_form = b;
		sendBG({
		cmd : "checkmultifactorsupport",
		type : b.eventdata1.value
		})
	} else if (b.eventtype.value == "verifymultifactor") {
		b.eventdata2.value = "working";
		g_form = b;
		sendBG({
		cmd : "verifymultifactor",
		eventdata1 : b.eventdata1.value
		})
	} else if (b.eventtype.value == "multifactorauth") {
		b.eventdata3.value = "working";
		g_form = b;
		sendBG({
		cmd : "multifactorauth",
		type : b.eventdata1.value,
		username : b.eventdata2.value,
		challenge : b.eventdata4.value
		})
	} else if (b.eventtype.value == "multifactorreprompt") {
		b.eventdata3.value = "working";
		g_form = b;
		sendBG({
		cmd : "multifactorreprompt",
		type : b.eventdata1.value,
		username : b.eventdata2.value,
		challenge : b.eventdata4.value
		})
	} else if (b.eventtype.value == "gohome")
		sendBG({
		cmd : "gohome",
		email : b.eventdata1.value,
		sesameotp : b.eventdata2.value,
		cmd : b.eventdata3.value
		});
	else
		b.eventtype.value == "lpgologin" && sendBG({
		cmd : "lpgologin",
		url : punycode.URLToASCII(a.location.href),
		data : b.eventdata1.value,
		session_key : b.eventdata2.value
		})
}
function checkdomain(a, b) {
	for ( var c = lp_gettld_url(punycode.URLToASCII(a.location.href)), e = b.split(","), d = 0; d < e.length; d++)
		if (e[d] == c)
			return true;
	return false
}
var firstfill = true;
function fillfield(a) {
	var b = a.docid ? g_fillreqdocs[a.docid] : document, c = typeof a.doconfirm != "undefined" ? a.doconfirm : false, e = typeof a.allowforce != "undefined" ? a.allowforce : 0, d = typeof a.aid != "undefined" ? a.aid : 0, g = typeof a.tabid != "undefined" ? a.tabid : 0, k = typeof a.custom_js != "undefined" ? a.custom_js : "", n = typeof a.manualfill != "undefined" ? a.manualfill : false, o = typeof a.username != "undefined" ? a.username : "", f = typeof a.password != "undefined" ? a.password : "", r = typeof a.onlyfill != "undefined" ? a.onlyfill : false, q = typeof a.automaticallyFill != "undefined" ? parseInt(a.automaticallyFill) : 1;
	if (a.is_launch)
		g_last_launch[d] = (new Date).getTime();
	if (checkdomain(b, a.domains)) {
		if (firstfill)
			if (k != "") {
				run_custom_js(b, lpPrepareCustomJS(k, o, f, "1", r, b));
				run_custom_js(b, lpPrepareCustomJS(k, o, f, "2", r, b))
			}
		if (a.highlight == 0)
			lpdisableHighlightField = 1;
		if (k = LP_setval(b, a.name, a.value, a.checked, a.aid, a.formname, a.type, a.sharedsite, a.otherfield, q))
			g_fillaid = d;
		if (firstfill)
			firstfill = false;
		c && sendBG({
		cmd : "fillfieldconfirm",
		manualfill : n,
		url : punycode.URLToASCII(b.location.href),
		result : k,
		aid : d,
		docid : a.docid,
		tabid : g,
		allowforce : e,
		automaticallyFill : q
		})
	} else
		console_error("Not filling because tld mismatch between " + punycode.URLToASCII(b.location.href) + " and " + a.domains)
}
function fillbest(a) {
	var b = a.docid ? g_fillreqdocs[a.docid] : document, c = typeof a.automaticallyFill != "undefined" ? parseInt(a.automaticallyFill) : 1;
	if (a.is_launch)
		g_last_launch[a.aid] = (new Date).getTime();
	if (checkdomain(b, a.domains)) {
		if (a.highlight == 0)
			lpdisableHighlightField = 1;
		run_custom_js(b, typeof a.custom_js != "undefined" ? a.custom_js : "");
		LP_setval_bestmatch(b, a.username, a.password, a.aid, a.updatefields, a.sharedsite, a.addurid, c)
	} else
		console_error("Not filling because tld mismatch between " + punycode.URLToASCII(b.location.href) + " and " + a.domains)
}
function submit(a) {
	var b = a.docid ? g_fillreqdocs[a.docid] : document;
	if (LP_last_form != null) {
		LP_doSubmit(b, LP_last_form, a.submit_id);
		if (b.body && typeof a.submit_html != "undefined" && a.submit_html != "")
			b.body.innerHTML += a.submit_html;
		typeof a.submit_js != "undefined" && a.submit_js != "" && window.eval(a.submit_js)
	}
}
function fillform(a) {
	LP_to_formfill = LPJSON.parse(a.toformfill);
	translations = LPJSON.parse(a.translations);
	LP_form_fill()
}
function saveall() {
	var a = "";
	if (typeof document.location != "undefined")
		a = punycode.URLToASCII(document.location.href);
	sendBG({
	cmd : "saveall",
	addsite : 1,
	url : a,
	formdata : LP_get_form_save_all()
	})
}
function LP_truncate_text_if(a) {
	if (typeof a == "string" && a.length > 45E3)
		a = a.substring(0, 45E3);
	return a
}
function LP_en(a) {
	return encodeURIComponent(a)
}
function LP_getname(a, b) {
	if (b && typeof a.id != "undefined" && a.id != "")
		return a.id;
	if (typeof a != "undefined" && a != null)
		if (typeof a.name == "string" && a.name != "")
			return a.name;
		else if (typeof a.id == "string")
			return a.id;
	return ""
}
function LP_getform_for_input(a, b) {
	for ( var c = a.getElementsByTagName("form"), e = 0; e < c.length; e++)
		for ( var d = c[e].elements, g = 0; g < d.length; g++) {
			var k = d[g];
			if (b == k) {
				if (LP_last_form != c[e] && (!LP_last_form || lpIsVisible(k)))
					LP_last_form = c[e];
				return c[e]
			}
		}
}
var fillcache = [];
function LP_setval(a, b, c, e, d, g, k, n, o, f) {
	for ( var r = a.getElementsByTagName(k == "select-one" ? "select" : k == "textarea" ? "textarea" : "input"), q = false, x = false, j = 1; j <= 2; j++) {
		var p = 0, u = r.length - 1;
		if (j == 2) {
			u = -1;
			if (o && !q) {
				var w = b.match(/^(input|select|textarea)(\d+)$/);
				if (w) {
					w = parseInt(w[2]);
					if (r.length > w)
						p = u = w
				}
			}
		}
		for (p = p; p <= u; p++) {
			w = r[p];
			if (j == 2 || LP_getname(w) == b)
				if (!(j == 1 && g != "" && (typeof w.form == "undefined" || !w.form || LP_getname(w.form) != g))) {
					q = true;
					if (!(w.value == c && typeof fillcache[b + k] != "undefined")) {
						fillcache[b + k] = 1;
						if ("password" == w.type || "text" == w.type || "email" == w.type || "textarea" == w.type || "select-one" == w.type) {
							if (w.form && !lpCheckWarnInsecure(w.form, w.form.ownerDocument, false))
								return false;
							if (k == "password" && w.type != "password")
								if (w.className.indexOf("watermark") == -1 && lp_gettld_url(punycode.URLToASCII(a.location.href)) != "imo.im")
									return false;
								else
									w.type = "password";
							if (n && k == "password")
								lpsharedpasswordfills[lpsharedpasswordfills.length] = w;
							if (f) {
								typeof d != "undefined" && d && typeof g_last_launch != "undefined" && typeof g_last_launch[d] != "undefined" && (new Date).getTime() - g_last_launch[d] <= 25E3 && w.focus();
								x = w.value != c;
								w.value = c;
								if (x && (w.type != "select-one" || w.value == c))
									fire_onchange(w)
							}
							lphighlightField(w);
							LP_getform_for_input(a, w);
							x = true
						} else if ("radio" == w.type) {
							if (f)
								if (w.value == c) {
									x = w.checked != e;
									w.checked = e;
									x && fire_onchange(w);
									x = true
								}
						} else if ("checkbox" == w.type)
							if (f) {
								x = w.checked != e;
								w.checked = e;
								x && fire_onchange(w);
								x = true
							}
					}
				}
		}
	}
	return x
}
function LP_setvaloffset(a, b, c, e, d, g, k, n) {
	b = b.elements[c];
	if ("password" == b.type || "text" == b.type || "email" == b.type || "textarea" == b.type || "select-one" == b.type) {
		if (b.form && !lpCheckWarnInsecure(b.form, b.form.ownerDocument, false))
			return false;
		if (d == "password" && b.type != "password")
			return false;
		if (k && d == "password")
			lpsharedpasswordfills[lpsharedpasswordfills.length] = b;
		if (g) {
			typeof n != "undefined" && n && typeof g_last_launch != "undefined" && typeof g_last_launch[n] != "undefined" && (new Date).getTime() - g_last_launch[n] <= 25E3 && b.focus();
			d = b.value != e;
			b.value = e;
			if (d && (b.type != "select-one" || b.value == e))
				fire_onchange(b)
		}
		lphighlightField(b);
		LP_getform_for_input(a, b)
	}
}
function LP_force(a, b, c) {
	for ( var e = document.getElementsByTagName("form"), d = 0; d < e.length; d++)
		for ( var g = e[d].elements, k = 0; k < g.length; k++) {
			var n = g[k];
			if ("password" == n.type && "password" == a || "text" == n.type && "text" == a || "email" == n.type && "email" == a) {
				typeof c != "undefined" && c && typeof g_last_launch != "undefined" && typeof g_last_launch[c] != "undefined" && (new Date).getTime() - g_last_launch[c] <= 25E3 && n.focus();
				a = n.value != b;
				n.value = b;
				a && fire_onchange(n);
				LP_last_form = e[d];
				return e[d]
			}
		}
}
function LP_setval_bestmatch(a, b, c, e, d, g, k, n) {
	var o = null, f = 0, r = 0, q = null, x = null, j = a.getElementsByTagName("form");
	if (j.length == 0) {
		for ( var p = document.getElementsByTagName("input"), u = 0; u < p.length; u++) {
			var w = p[u].type;
			if ((w == "text" || w == "email") && (q == null || x == null))
				q = LP_getname(p[u]);
			if (w == "password" && x == null)
				x = LP_getname(p[u])
		}
		if (x != null)
			o = ""
	}
	for (u = 0; u < j.length; u++) {
		p = j[u].elements;
		for ( var z = w = 0, J = 0, H = 0, D = null, U = null, W = 0; W < p.length; W++) {
			var K = p[W];
			if ("text" == K.type && K.className.indexOf("watermark") >= 0)
				K.type = "password";
			if ("text" == K.type || "email" == K.type) {
				if (w == 0 || z == 0) {
					D = LP_getname(K);
					J = W
				}
				w++
			}
			if (K.type == "password") {
				if (z == 0) {
					U = LP_getname(K);
					H = W
				}
				z++
			}
		}
		if (z == 1)
			if (!o || w == 1 && f != 1) {
				f = w;
				o = j[u];
				q = D;
				x = U;
				besttextoffset = J;
				r = H
			}
	}
	if (o != null) {
		if (b != "")
			q != "" ? LP_setval(a, q, b, 0, e, o == "" ? "" : LP_getname(o), "", g, null, n) : LP_setvaloffset(a, o, besttextoffset, b, "text", n, g, e);
		x != "" ? LP_setval(a, x, c, 0, e, o == "" ? "" : LP_getname(o), "", g, null, n) : LP_setvaloffset(a, o, r, c, "password", n, g, e);
		if (d)
			a.LPlpsaveforminfo = e;
		else if (k)
			a.LPlpsaveforminfoaddurid = e
	}
}
function lpCheckWarnInsecure(a, b, c) {
	if (a) {
		if (!c && typeof lpdontfillautocompleteoff != "undefined" && lpdontfillautocompleteoff)
			if (a.getAttribute("autocomplete") == "off")
				return null;
		if (typeof lpwarninsecureforms != "undefined" && lpwarninsecureforms)
			if (a.method && typeof a.method == "string" && a.method.toUpperCase() == "GET" || typeof a.action == "string" && a.action.indexOf("mailto:") == 0) {
				if (typeof g_warnedUserThisPageLogin == "undefined")
					g_warnedUserThisPageLogin = 1;
				else
					return;
				if (!confirm(gs("LastPass detected a login form that is insecure.\n\nWould you like to continue?")))
					return null
			}
	}
	return a
}
function lphighlightField(a, b) {
	if (!(typeof lpdisableHighlightField != "undefined" && lpdisableHighlightField))
		if (!(a.type != "text" && a.type != "password" && a.type != "email")) {
			var c = false;
			if (typeof b == "undefined")
				c = b = true;
			var e = a.style.width.replace(/px/, "");
			if (e == "")
				try {
					var d = a.ownerDocument.defaultView.getComputedStyle(a, "");
					e = d.width.replace(/px/, "")
				} catch (g) {
				}
			if (!(e > 0 && e < 30)) {
				e = a.style.backgroundImage;
				if (e == "")
					try {
						d = a.ownerDocument.defaultView.getComputedStyle(a, "");
						e = d.backgroundImage
					} catch (k) {
					}
				if (e == "none")
					e = "";
				if (e == "")
					a.style.backgroundImage = b ? "url(data:image/gif;base64,R0lGODlhEAAQAMQAAHgAFq9RZp8BJfT09JkCJKUuSO/q6/n//vHh5YYBGvf6+tOyucB0hsuLmpUiOpIAHIgJJtzFy7pneuvT2fP49/Dw8L5/juS+x8Scpn4BHaMDJ3cAHHQAG6YDKHEAGv///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjEgNjQuMTQwOTQ5LCAyMDEwLzEyLzA3LTEwOjU3OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOkZCN0YxMTc0MDcyMDY4MTFCRURDRjg2RUEzOUI0MjBEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjUyQjY0RUJGQTQ2QzExRTA5MkM2OTcwNjIwMUM1QjhFIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjUyQjY0RUJFQTQ2QzExRTA5MkM2OTcwNjIwMUM1QjhFIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgTWFjaW50b3NoIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RkE3RjExNzQwNzIwNjgxMTkyQjA4Nzg0MUEyMjBGMUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RkI3RjExNzQwNzIwNjgxMUJFRENGODZFQTM5QjQyMEQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQAAAAAACwAAAAAEAAQAAAFmGAnjmTZaSgqCCqbautKdMVaOEQsEDkRTAjN44IIyHi8R+DzYRSYjAcy+Ug0PojJZ/HoUh2BgGRwOCga4UK3uiwP3mSmJVFNBBQVQwWuVzASgAkQDmAVFIcShBCAGY0ZAAsHEZEREACOjgABBxQBDhUHFpeNG6UcDhgLHgCpBQClsKUeHBAeGxkctrAcvL2zub2+HsPExcYhADs=)" : "";
				else
					c = false;
				d = a.offsetWidth;
				if (e == "") {
					a.style.paddingRight = b ? "18px" : "0px";
					a.style.backgroundRepeat = "no-repeat";
					a.style.backgroundAttachment = "scroll";
					a.style.backgroundPosition = "center right"
				}
				a.style.border = "1px solid #c01f2f";
				if (d > 0) {
					a.style.width = d + "px";
					a.style.width = 2 * d - a.offsetWidth + "px"
				}
				if (c && d > 0 && d < 54) {
					a.addEventListener("focus", function() {
						lphighlightField(a, false)
					}, false);
					a.addEventListener("blur", function() {
						lphighlightField(a, true)
					}, false)
				}
			}
		}
}
function LP_fireEvent(a, b, c) {
	c || (c = "HTMLEvents");
	if (document.createEventObject) {
		c = document.createEventObject();
		return a.fireEvent("on" + b, c)
	} else {
		c = document.createEvent(c);
		c.initEvent(b, true, true);
		return !a.dispatchEvent(c)
	}
}
function LP_doSubmit(a, b, c) {
	var e = 0;
	if (c != "") {
		var d = a.getElementById(c);
		if (!d) {
			var g = a.getElementsByName(c);
			if (g && g.length > 0)
				d = g[0]
		}
		if (!d)
			if (g = a.getElementsByTagName("INPUT"))
				for ( var k = 0; k < g.length; k++)
					if (g[k].value == c)
						d = g[k];
		if (!d)
			if (g = a.getElementsByTagName("A"))
				for (k = 0; k < g.length; k++)
					if (g[k].href == c)
						d = g[k];
		if (d) {
			LP_fireEvent(d, "click", "MouseEvents");
			e = 1
		}
	}
	e || (e = LP_InputClickToSubmit(a, b, "submit"));
	e || (e = LP_InputClickToSubmit(a, b, "image"));
	e || (e = LP_InputClickToSubmit(a, b, "button"));
	if (!e) {
		if (lp_gettld_url(punycode.URLToASCII(a.location.href)) != "bankofamerica.com") {
			try {
				LP_fireEvent(b, "submit")
			} catch (n) {
			}
			try {
				b.submit()
			} catch (o) {
				return o.toString()
			}
		}
		b = null;
		if (g = a.getElementsByTagName("INPUT"))
			for (k = 0; k < g.length; k++)
				if (g[k].type == "password")
					b = g[k];
		if (b) {
			b.focus();
			a.createEvent("KeyboardEvent").initKeyboardEvent("keypress", true, true, lpgettop(), "Enter", 0, false, false, false, false)
		}
	}
}
function LP_get_form_save_all() {
	for ( var a = "", b = document.getElementsByTagName("form"), c = [ "" ], e = 0; e < b.length; e++)
		a += LP_get_form_save(b[e], true, c);
	b = "";
	for ( var d = [ "input", "select", "textarea" ], g = 0; g < d.length; g++) {
		var k = document.getElementsByTagName(d[g]);
		for (e = 0; e < k.length; e++)
			if (k[e].form == null || lp_in_array(LP_getname(k[e]), c)) {
				var n = lp_in_array(LP_getname(k[e]), c) ? d[g] + e : null;
				b += LP_get_field_text("", k[e], {}, {}, false, n)
			}
	}
	if (b != "") {
		b += "0\taction\t\taction\n";
		b += "0\tmethod\t\tmethod\n";
		a += b
	}
	return a
}
function LP_get_form_save(a, b, c) {
	var e = "", d = {};
	d.value = 0;
	var g = a.elements, k = {};
	k.value = false;
	var n = [], o = [], f = [], r = [];
	if (b)
		for ( var q = 0; q < g.length; q++) {
			if (typeof n[g[q].name] != "undefined")
				f[g[q].name] = true;
			n[g[q].name] = true;
			if (typeof o[g[q].id] != "undefined")
				r[g[q].id] = true;
			o[g[q].id] = true
		}
	for (q = 0; q < g.length; q++) {
		if (b) {
			n = LP_getname(g[q]);
			if (n == "" || typeof f[n] != "undefined" && typeof r[n] != "undefined") {
				c[c.length] = n;
				continue
			}
		}
		e += LP_get_field_text(LP_getname(a), g[q], d, k, b)
	}
	if (k.value && !lpCheckWarnInsecure(a, a.ownerDocument, true))
		return null;
	e += "0\taction\t" + LP_en(a.action) + "\taction\n";
	e += "0\tmethod\t" + LP_en(a.method) + "\tmethod\n";
	if (d.value)
		return e;
	return ""
}
function LP_get_field_text(a, b, c, e, d, g) {
	var k = "";
	g = g ? g : LP_getname(b);
	var n = b.type, o = LP_truncate_text_if(b.value);
	if (d && o == "" && b.name && b.name != "")
		for ( var f = document.getElementsByName(b.name), r = 0; r < f.length; r++)
			if (LP_getname(f[r].form) == a && LP_getname(f[r]) == g && f[r].type == n && f[r].value != "")
				return "";
	if (n == "password")
		e.value = true;
	if ("password" == n || "text" == n || "email" == n || "textarea" == n || "hidden" == n) {
		if ("hidden" != n)
			c.value = 1;
		if (!d && lpsavedform == b.form)
			for (c = 0; c < lpsavedformfields.length; c++)
				if (lpsavedformfields[c].name == LP_getname(b)) {
					if (lpsavedformfields[c].value != o)
						if (o == "" || o.match(/^\*+$/))
							o = lpsavedformfields[c].value;
						else if (o.length == lpsavedformfields[c].value.length) {
							e = true;
							for (r = 0; r < o.length; r++)
								if (o.charAt(r) != lpsavedformfields[c].value.charAt(r) && o.charAt(r) != "*") {
									e = false;
									break
								}
							if (e)
								o = lpsavedformfields[c].value
						}
					break
				}
		if (n == "password")
			for (c = 0; c < lpsharedpasswordfills.length; c++)
				if (lpsharedpasswordfills[c] == b) {
					o = "";
					break
				}
		k += a + "\t" + LP_en(g) + "\t" + LP_en(o) + "\t" + LP_en(n) + "\n"
	} else if ("checkbox" == n || "radio" == n) {
		o += b.checked ? "-1" : "-0";
		k += a + "\t" + LP_en(g) + "\t" + LP_en(o) + "\t" + LP_en(n) + "\n"
	} else if ("select-one" == n || "dropdown" == n || "select-multiple" == n) {
		if (n == "select-multiple") {
			r = o = "";
			for (c = 0; c < b.options.length; c++)
				if (b.options[c].selected) {
					o += r + LP_en(b.options[c].value);
					r = "|"
				}
		} else
			o = b.selectedIndex < 0 || b.selectedIndex >= b.options.length || typeof b.options[b.selectedIndex] == "undefined" ? "" : b.options[b.selectedIndex].value;
		k += a + "\t" + LP_en(g) + "\t" + LP_en(o) + "\t" + LP_en(n) + "\n"
	} else if ("image" == n) {
		o = b.src;
		k += a + "\t" + LP_en(g) + "\t" + LP_en(o) + "\t" + LP_en(n) + "\n"
	}
	return k
}
function evaluntilfindmanual(a) {
	if (!g_foundmanual || typeof a != "undefined" && a) {
		a = lpgettop().document;
		hookAllFormSubmits(a);
		try {
			for ( var b = 0; a.frames && b < a.frames.length; b++)
				hookAllFormSubmits(a.frames[b].document)
		} catch (c) {
		}
		lpgettop().setTimeout(function() {
			evaluntilfindmanual()
		}, 500)
	}
}
function lpfieldfocus(a) {
	a = a ? a.target : this;
	if (a.form && a.form.getAttribute("_lpchecked") == null) {
		a.form.setAttribute("_lpchecked", "1");
		sendBG({
		cmd : "checkgenpwfillforms",
		url : punycode.URLToASCII(document.location.href)
		})
	}
}
function lpfieldchange(a) {
	a = a ? a.target : this;
	if (a.form) {
		lpsavedform = a.form;
		if (LP_getname(a) != "" && ("text" == a.type || "email" == a.type || "password" == a.type)) {
			for ( var b = false, c = 0; c < lpsavedformfields.length; c++)
				if (lpsavedformfields[c].formname == LP_getname(lpsavedform) && lpsavedformfields[c].name == LP_getname(a)) {
					lpsavedformfields[c].value = a.value;
					b = true;
					break
				}
			if (!b) {
				b = {};
				b.name = LP_getname(a);
				b.type = a.type;
				b.value = a.value;
				b.formname = LP_getname(lpsavedform);
				lpsavedformfields[lpsavedformfields.length] = b
			}
		}
	}
}
function lpshownotification(a, b) {
	if (typeof NONOTIFICATIONS == "undefined")
		if (!document.getElementById("xml-viewer-style"))
			try {
				if (!(a != "context" && (document.getElementById("lastpass-notification") || document.getElementById("lpiframeoverlay" + g_iframerand)))) {
					var c = lpgettop();
					if (!(typeof c != "undefined" && typeof c.location != "undefined" && typeof c.location.href != "undefined" && c && window != c)) {
						var e = document.body;
						if (e)
							if (!(typeof b.docnum != "undefined" && g_docnum != b.docnum)) {
								c = true;
								if (a == "fill") {
									if (checkForLoginForm(document)) {
										var d = getAutoFillArray(LPJSON.parse(b.sites));
										if (getcount(d) == 1)
											for ( var g in d) {
												c = typeof d[g].fields == "undefined" || getcount(d[g].fields) == 0 || !canFindForm(d[g].fields) || !g_fillaid;
												break
											}
									} else
										c = false;
									if (g_fillaid == null)
										b.text = gs("Simplify your life: Use LastPass to autofill in this site's login info!")
								}
								if (c) {
									experimentaloverlay || addStyle();
									g_isopera && !experimentaloverlay && a == "fill" ? run_custom_js(document, showExtTableScript()) : run_custom_js(document, showMenuScript());
									d = null;
									if (!experimentaloverlay) {
										d = document.createElement("div");
										d.id = "lastpass-notification";
										d.style.background = get_notification_bg();
										d.style.backgroundRepeat = "repeat-x";
										if (g_isopera)
											d.unselectable = "on";
										var k = window.getComputedStyle(e, null);
										d.style.marginLeft = -1 * (parseInt(k.getPropertyValue("margin-left")) + parseInt(k.getPropertyValue("padding-left")) + parseInt(k.getPropertyValue("border-left-width"))) + "px";
										d.style.marginRight = -1 * (parseInt(k.getPropertyValue("margin-right")) + parseInt(k.getPropertyValue("padding-right")) + parseInt(k.getPropertyValue("border-right-width"))) + "px";
										d.style.marginTop = -1 * (parseInt(k.getPropertyValue("margin-top")) + parseInt(k.getPropertyValue("padding-top")) + parseInt(k.getPropertyValue("border-top-width"))) + "px"
									}
									k = "";
									g = 1;
									c = g_isopera ? "float:left;" : "";
									k = '<img width="16" height="16" style="width:16px;height:16px;display:inline;' + c + '" src="data:image/gif;base64,R0lGODdhEAAQAPQfAHEAGq9RZp8BJfT09JkCJKUuSO/q6/n//vHh5YYBGvf6+tOyucB0hsuLmpUiOpIAHIgJJtzFy7pneuvT2fP49/Dw8L5/juS+x8Scpn4BHaMDJ3cAHHQAG6YDKP///3gAFiH/C1hNUCBEYXRhWE1QRj94cDI2NkQzRERDQjk3IiB4bXBNTTpJbnN0YW5jZUlEPVJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4ALAAAAAAQABAAAAWYYCeOZNlpKCoIKptq60p0xVo4RCwQORFMCM3jggjIeLxHwONhFJiMBzL5SDQ8iIln8ehSHYGAZHA4KBrhQre6LA/eZKYlUU0EFBVDBa5XMBKACRAOYBUUhxKEEIAZjRkfCwcRkREQH46OHwEHFAEOFQcWl40bpRwOGAsAH6kFH6WwpQAcEAAbGRy2sBy8vbO5vb4Aw8TFxiEAOw=="/>';
									if (typeof b.icon != "undefined")
										k = '<img style="display:inline;' + c + '" src="' + b.icon + '"/>';
									k += '<div id="lastpass-content" style="color:white;' + g_webkit_selectable + '" ' + g_opera_selectable + ">" + b.text + "</div>";
									k += experimentaloverlay ? '<img width="16" height="16" lptype="close" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABYklEQVR42qXTvWrCUBQHcKe+QqfundPFxT0OnTJ0MtChmw/g4NgH6FtkEwoBv8BEA8EYFGswBIIEhFCrU4V26cfp+Qe5RLlKwcAPknty/7mHe1NoNBoy9+yZJWzBcN3J3j0cuGJJt9ul0WhEYRjSfD4nz/Oo0+kQ10J2eSygyL4xcb1eyyAUIV/sWhawHY/HtFqtTvJ9HyGbw4B6r9ejNE3/ZdfOQz4gnkwmtFwuM7VajRRFIcMwyLIs3GNM1HetePmA9yAIKEkSoVqtUrlcBtzv1abTKQJe9wIwGMexgGd8GQ5rvFoEvOUDFtiqKIoEXddJVdWMpml7Ndd1EfCSD3jC3mPPoVKpUKlUItM0AavAmKi3220E1PMBF+zTcRyazWYn9ft9Qsuyc3DLfm3bRs8y2BFM/mFFWQDcsE2r1SKsZjgcZgaDATWbTUxOxSmUBwiPLGEfOzGrH/uZzlIgorP8ASYfyJK1fcokAAAAAElFTkSuQmCC" id="lphideoverlay" style="width:16px;height:16px;float: right; margin-right: 10px; margin-bottom: -10px;"/> ' : '<img width="16" height="16" lptype="close" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABYklEQVR42qXTvWrCUBQHcKe+QqfundPFxT0OnTJ0MtChmw/g4NgH6FtkEwoBv8BEA8EYFGswBIIEhFCrU4V26cfp+Qe5RLlKwcAPknty/7mHe1NoNBoy9+yZJWzBcN3J3j0cuGJJt9ul0WhEYRjSfD4nz/Oo0+kQ10J2eSygyL4xcb1eyyAUIV/sWhawHY/HtFqtTvJ9HyGbw4B6r9ejNE3/ZdfOQz4gnkwmtFwuM7VajRRFIcMwyLIs3GNM1HetePmA9yAIKEkSoVqtUrlcBtzv1abTKQJe9wIwGMexgGd8GQ5rvFoEvOUDFtiqKIoEXddJVdWMpml7Ndd1EfCSD3jC3mPPoVKpUKlUItM0AavAmKi3220E1PMBF+zTcRyazWYn9ft9Qsuyc3DLfm3bRs8y2BFM/mFFWQDcsE2r1SKsZjgcZgaDATWbTUxOxSmUBwiPLGEfOzGrH/uZzlIgorP8ASYfyJK1fcokAAAAAElFTkSuQmCC" onmouseover="this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABX0lEQVR42qXTsWrCUBTGcaFroZNTwQfo1KnQN3CQblLIkD2CFIqbaEBQsGAIJBAaCIoQI4JKoeADFDpVmuCsUyE4FJyznJ4vSEjkKgWFH4R7cv/RS8zNZjORO/bMXDZkT+xWdO/hwtV+E02n0wxeg1d2eSxQYD+TyYRc1xXiGSIblhcFPnGT4zgnjUYjRBaHgaLneWSa5r+Mx2NE7tOBvmVZ1O22Y8vlkqIoovl8ToPBANdYS+a2bSPwkg58YNBsNhNBENB2uwVcZ2a9Xg+Bt0yg1WpRrVZLNBoNPBlwnZm1220E3tOBIQKKoiRWqxWFYRhbr9eZWafTQcBIBx4NwyBZlmO+79Nut8OTAd8Ca8kc54WDTwcu2He9XqdyuXySqqqEnyx6D27YLyKlUkkEB4jNISuIAnDNFpqmUaVSIUmSYtVqlXRdx2Z88uJXOeuBuexrr8+Kx/5MZ8kR0Vn+AGczfuZVuZDxAAAAAElFTkSuQmCC\'" onmouseout="this.src=\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABYklEQVR42qXTvWrCUBQHcKe+QqfundPFxT0OnTJ0MtChmw/g4NgH6FtkEwoBv8BEA8EYFGswBIIEhFCrU4V26cfp+Qe5RLlKwcAPknty/7mHe1NoNBoy9+yZJWzBcN3J3j0cuGJJt9ul0WhEYRjSfD4nz/Oo0+kQ10J2eSygyL4xcb1eyyAUIV/sWhawHY/HtFqtTvJ9HyGbw4B6r9ejNE3/ZdfOQz4gnkwmtFwuM7VajRRFIcMwyLIs3GNM1HetePmA9yAIKEkSoVqtUrlcBtzv1abTKQJe9wIwGMexgGd8GQ5rvFoEvOUDFtiqKIoEXddJVdWMpml7Ndd1EfCSD3jC3mPPoVKpUKlUItM0AavAmKi3220E1PMBF+zTcRyazWYn9ft9Qsuyc3DLfm3bRs8y2BFM/mFFWQDcsE2r1SKsZjgcZgaDATWbTUxOxSmUBwiPLGEfOzGrH/uZzlIgorP8ASYfyJK1fcokAAAAAElFTkSuQmCC\'" style="width:16px;height:16px;float: right; margin-right: 10px; margin-bottom: -10px;" onclick="this.dispatchEvent(lpcustomEvent); document.getElementById(\'lastpass-notification\').style.display=\'none\'"/> ';
									c = 0;
									if (a == "fill")
										k += createFillMenus(b);
									else if (a == "add") {
										k += createAddButtons(b);
										c = 1;
										if (d)
											d.style.background = get_notification_add_bg()
									} else if (a == "generate") {
										k += createGenerateButtons(b);
										c = 2
									} else if (a == "formfill") {
										k += createFormFillButtons(b);
										c = 3
									} else if (a == "change")
										k += createChangeButtons(b);
									else if (a == "error") {
										k += createErrorButtons(b);
										if (typeof b.yellow == "undefined" || !b.yellow) {
											if (d)
												d.style.background = "#ff0000"
										} else
											g = 2
									} else if (a == "basicauth")
										k += createBasicAuthButtons(b);
									else if (a == "context") {
										k = createContextMenu(b);
										g = "context"
									}
									if (d)
										d.innerHTML = k + "</div>";
									g_isopera && !experimentaloverlay && a == "fill" ? run_custom_js(document, "document.addEventListener('mouseup', function(e){ if(typeof(closelpmenus)=='function') { if (!chk_should_close_exttable(e)) {  return; } closelpmenus(); } }, false)") : run_custom_js(document, "document.addEventListener('mouseup', function(e){ if(typeof(closelpmenus)=='function'){closelpmenus();}}, false)");
									d && e.insertBefore(d, e.firstChild);
									g_isopera && !experimentaloverlay && a == "fill" && initialize_sorttable();
									curr_notification_type = a;
									if (experimentaloverlay) {
										var n = {
										document_location_href : punycode.URLToASCII(document.location.href),
										g_fillaid : g_fillaid,
										from : c,
										type : a
										};
										if (typeof b.notificationdata != "undefined")
											n.notificationdata = b.notificationdata;
										sendBG({
										cmd : "savenotificationhtml",
										text : k,
										extra : LPJSON.stringify(n)
										});
										showoverlay(b, "&" + a + "=" + g)
									}
								} else if (typeof lpNotificationsAfterClick == "undefined" || !lpNotificationsAfterClick)
									sendBG({
									cmd : "checkgenpwfillforms",
									url : punycode.URLToASCII(document.location.href)
									})
							}
					}
				}
			} catch (o) {
				console_log(o.message)
			}
}
function lpclosenotification(a, b) {
	if ((document.getElementById("lastpass-notification") || document.getElementById("lpiframeoverlay" + g_iframerand)) && (a || curr_notification_type != "error") && (!b || curr_notification_type == "error")) {
		document.getElementById("lastpass-notification") ? document.body.removeChild(document.getElementById("lastpass-notification")) : document.body.removeChild(document.getElementById("lpiframeoverlay" + g_iframerand));
		curr_notification_type = ""
	}
}
function sitesMatchTLD(a) {
	var b = lp_gettld_url(punycode.URLToASCII(document.location.href)), c;
	for (c in a)
		if (b == lp_gettld_url(a[c].url))
			return true;
	return false
}
function createFillMenus(a) {
	var b = "";
	a = getAutoFillArray(LPJSON.parse(a.sites));
	var c = getcount(a), e = getAutoLoginArray(a), d = getcount(e);
	b += experimentaloverlay ? "<button type='button' id='lpnever' class='lpbutton' value='" + gs("Never...") + "'>" + gs("Never...") + "</button>" : "<button type='button' id='lpnever' class='lpbutton' value='" + gs("Never...") + "' onclick='lpshowmenudiv(\"never\");return false;'>" + gs("Never...") + "</button>";
	if (c == 1)
		for ( var g in a)
			b += experimentaloverlay ? "<button lptype='autofillsingle' aid=\"" + a[g].aid + "\" type='button' id='lpautofill' class='lpbutton' value='" + gs("AutoFill") + "'>" + gs("AutoFill") + "</button>" : "<button lptype='autofillsingle' aid=\"" + a[g].aid + "\" type='button' id='lpautofill' class='lpbutton' value='" + gs("AutoFill") + "' onclick='this.dispatchEvent(lpcustomEvent);'>" + gs("AutoFill") + "</button>";
	else
		b += experimentaloverlay ? "<button id='lpautofill' class='lpbutton' value='" + gs("AutoFill") + " (" + c + ")'>" + gs("AutoFill") + " (" + c + ")</button>" : "<button id='lpautofill' class='lpbutton' value='" + gs("AutoFill") + " (" + c + ")' onclick='lpshowmenudiv(\"autofill\")'>" + gs("AutoFill") + " (" + c + ")</button>";
	if (1 == d)
		for (g in e)
			b += experimentaloverlay ? "<button lptype='autologinsingle' aid=\"" + e[g].aid + "\" type='button' id='lpautologin' class='lpbutton' value='" + gs("AutoLogin") + "'>" + gs("AutoLogin") + "</button>" : "<button lptype='autologinsingle' aid=\"" + e[g].aid + "\" type='button' id='lpautologin' class='lpbutton' value='" + gs("AutoLogin") + "' onclick='this.dispatchEvent(lpcustomEvent);'>" + gs("AutoLogin") + "</button>";
	else if (d > 0)
		b += experimentaloverlay ? "<button id='lpautologin' class='lpbutton' value='" + gs("AutoLogin") + " (" + d + ")'>" + gs("AutoLogin") + " (" + d + ")</button>" : "<button id='lpautologin' class='lpbutton' value='" + gs("AutoLogin") + " (" + d + ")' onclick='lpshowmenudiv(\"autologin\")'>" + gs("AutoLogin") + " (" + d + ")</button>";
	if (d > 0)
		b += createMenu("autologin", e, d);
	b += createMenu("autofill", a, c);
	b += createNeverMenu(g_fillaid != null);
	experimentaloverlay || document.addEventListener("lpCustomEventMenu", function(k) {
		var n = k.srcElement.getAttribute("lptype");
		if (n == "autologin") {
			sendBG({
			cmd : "autologinaid",
			aid : k.srcElement.getAttribute("aid")
			});
			document.getElementById("lppopupautologin").style.display = "none"
		} else if (n == "autologinsingle") {
			sendBG({
			cmd : "autologinaid",
			aid : k.srcElement.getAttribute("aid")
			});
			document.getElementById("lastpass-notification").style.display = "none"
		} else if (n == "autofill") {
			sendBG({
			cmd : "autofillaid",
			aid : k.srcElement.getAttribute("aid")
			});
			document.getElementById("lppopupautofill").style.display = "none"
		} else if (n == "autofillsingle") {
			sendBG({
			cmd : "autofillaid",
			aid : k.srcElement.getAttribute("aid")
			});
			document.getElementById("lastpass-notification").style.display = "none"
		} else if (n == "neverautofill" || n == "neverpage" || n == "neverdomain") {
			sendBG({
			cmd : n,
			url : punycode.URLToASCII(document.location.href),
			aid : g_fillaid
			});
			document.getElementById("lppopupnever").style.display = "none";
			document.getElementById("lastpass-notification").style.display = "none"
		} else if (n == "autofilltabsearchboxreset")
			clear_searchbox("autofill");
		else if (n == "autologintabsearchboxreset")
			clear_searchbox("autologin");
		else if (n == "autologintabsearchbox")
			dofilter("autologin");
		else
			n == "autofilltabsearchbox" && dofilter("autofill")
	}, false);
	return b
}
function createAddButtons(a) {
	var b = "";
	b += experimentaloverlay ? "<button type='button' lptype='notnow' id='lpnotnow' class='lpbutton' value='" + gs("Not Now") + "'>" + gs("Not Now") + "</button>" : "<button type='button' lptype='notnow' id='lpnotnow' class='lpbutton' value='" + gs("Not Now") + "' onclick='this.dispatchEvent(lpcustomEvent);'>" + gs("Not Now") + "</button>";
	b += experimentaloverlay ? "<button type='button' id='lpnever' class='lpbutton' value='" + gs("Never...") + "'>" + gs("Never...") + "</button>" : "<button type='button' id='lpnever' class='lpbutton' value='" + gs("Never...") + "' onclick='lpshowmenudiv(\"never\");'>" + gs("Never...") + "</button>";
	b += experimentaloverlay ? "<button type='button' lptype='addsite' id='lpaddsite' class='lpbutton' value='" + gs("Save Site") + "'>" + gs("Save Site") + "</button>" : "<button type='button' lptype='addsite' id='lpaddsite' class='lpbutton' value='" + gs("Save Site") + "' onclick='this.dispatchEvent(lpcustomEvent);'>" + gs("Save Site") + "</button>";
	b += createNeverMenu(0, 1);
	experimentaloverlay || document.addEventListener("lpCustomEventMenu", function(c) {
		c = c.srcElement.getAttribute("lptype");
		if (c == "addsite") {
			sendBG({
			cmd : "savethesite",
			notificationdata : a.notificationdata
			});
			document.getElementById("lastpass-notification").style.display = "none"
		} else if (c == "notnow") {
			sendBG({
			cmd : "notnow",
			notificationdata : a.notificationdata,
			tld : lp_gettld_url(punycode.URLToASCII(document.location.href))
			});
			document.getElementById("lastpass-notification").style.display = "none"
		} else if (c == "close")
			sendBG({
				cmd : "clearnotification"
			});
		else if (c == "neverpage" || c == "neverdomain") {
			var e = LPJSON.parse(a.notificationdata).url;
			sendBG({
			cmd : c,
			url : e,
			fromsave : "1",
			notificationdata : a.notificationdata,
			tld : lp_gettld_url(punycode.URLToASCII(document.location.href))
			});
			document.getElementById("lppopupnever").style.display = "none";
			document.getElementById("lastpass-notification").style.display = "none"
		}
	}, false);
	return b
}
function createChangeButtons(a) {
	var b = "";
	b += experimentaloverlay ? "<button type='button' lptype='savenewsite' id='lpsavenewsite' class='lpbutton' value='" + gs("Save New Site") + "'>" + gs("Save New Site") + "</button>" : "<button type='button' lptype='savenewsite' id='lpsavenewsite' class='lpbutton' value='" + gs("Save New Site") + "' onclick='this.dispatchEvent(lpcustomEvent);'>" + gs("Save New Site") + "</button>";
	b += experimentaloverlay ? "<button type='button' lptype='confirm' id='lpconfirm' class='lpbutton' value='" + gs("Confirm") + "'>" + gs("Confirm") + "</button>" : "<button type='button' lptype='confirm' id='lpconfirm' class='lpbutton' value='" + gs("Confirm") + "' onclick='this.dispatchEvent(lpcustomEvent);'>" + gs("Confirm") + "</button>";
	experimentaloverlay || document.addEventListener("lpCustomEventMenu", function(c) {
		c = c.srcElement.getAttribute("lptype");
		if (c == "savenewsite") {
			sendBG({
			cmd : "savethesite",
			notificationdata : a.notificationdata
			});
			document.getElementById("lastpass-notification").style.display = "none"
		} else if (c == "confirm") {
			sendBG({
			cmd : "changepw",
			notificationdata : a.notificationdata
			});
			document.getElementById("lastpass-notification").style.display = "none"
		} else
			c == "close" && sendBG({
				cmd : "clearnotification"
			})
	}, false);
	return b
}
function createErrorButtons(a) {
	var b = "";
	if (a.notificationdata.multifactor_disable_url)
		b += experimentaloverlay ? "<button type='button' lptype='disablebtn' id='lpdisablebtn' class='lpbutton' value='" + gs("Disable Multifactor Authentication") + "'>" + gs("Disable Multifactor Authentication") + "</button>" : "<button type='button' lptype='disablebtn' id='lpdisablebtn' class='lpbutton' value='" + gs("Disable Multifactor Authentication") + "' onclick='this.dispatchEvent(lpcustomEvent);'>" + gs("Disable Multifactor Authentication") + "</button>";
	if (a.notificationdata.showCreateAccount)
		b += experimentaloverlay ? "<button type='button' lptype='createaccountbtn' id='lpcreateaccountbtn' class='lpbutton' value='" + gs("Create Account") + "'>" + gs("Create Account") + "</button>" : "<button type='button' lptype='createaccountbtn' id='lpcreateaccountbtn' class='lpbutton' value='" + gs("Create Account") + "' onclick='this.dispatchEvent(lpcustomEvent);'>" + gs("Create Account") + "</button>";
	if (a.notificationdata.showLogin)
		b += experimentaloverlay ? "<button type='button' lptype='tryagainbtn' id='lptryagainbtn' class='lpbutton' value='" + gs("Try Again") + "'>" + gs("Try Again") + "</button>" : "<button type='button' lptype='tryagainbtn' id='lptryagainbtn' class='lpbutton' value='" + gs("Try Again") + "' onclick='this.dispatchEvent(lpcustomEvent);'>" + gs("Try Again") + "</button>";
	if (a.notificationdata.showFeedback)
		b += experimentaloverlay ? "<button type='button' lptype='feedbackbtn' id='lpfeedbackbtn' class='lpbutton' value='" + gs("Feedback") + "'>" + gs("Feedback") + "</button>" : "<button type='button' lptype='feedbackbtn' id='lpfeedbackbtn' class='lpbutton' value='" + gs("Feedback") + "' onclick='this.dispatchEvent(lpcustomEvent);'>" + gs("Feedback") + "</button>";
	experimentaloverlay || document.addEventListener("lpCustomEventMenu", function(c) {
		c = c.srcElement.getAttribute("lptype");
		sendBG({
		cmd : c,
		notificationdata : a.notificationdata
		});
		document.getElementById("lastpass-notification").style.display = "none"
	}, false);
	return b
}
function createBasicAuthButtons(a) {
	var b = "";
	b += experimentaloverlay ? "<button type='button' lptype='basicauthneverbtn' id='lpbasicauthneverbtn' class='lpbutton' value='" + gs("Never Show Again") + "'>" + gs("Never Show Again") + "</button>" : "<button type='button' lptype='basicauthneverbtn' id='lpbasicauthneverbtn' class='lpbutton' value='" + gs("Never Show Again") + "' onclick='this.dispatchEvent(lpcustomEvent);'>" + gs("Never Show Again") + "</button>";
	var c = a.needbinary == 1 ? gs("Install") : gs("More Information");
	b += experimentaloverlay ? "<button type='button' lptype='basicauthmoreinfobtn' id='lpbasicauthmoreinfobtn' class='lpbutton' value='" + c + "'>" + c + "</button>" : "<button type='button' lptype='basicauthmoreinfobtn' id='lpbasicauthmoreinfobtn' class='lpbutton' value='" + c + "' onclick='this.dispatchEvent(lpcustomEvent);'>" + c + "</button>";
	experimentaloverlay || document.addEventListener("lpCustomEventMenu", function(e) {
		e = e.srcElement.getAttribute("lptype");
		sendBG({
		cmd : e,
		notificationdata : a.notificationdata
		});
		document.getElementById("lastpass-notification").style.display = "none"
	}, false);
	return b
}
function createGenerateButtons(a) {
	var b = "";
	b += experimentaloverlay ? "<button type='button' id='lpnever' class='lpbutton' value='" + gs("Never...") + "'>" + gs("Never...") + "</button>" : "<button type='button' id='lpnever' class='lpbutton' value='" + gs("Never...") + "' onclick='lpshowmenudiv(\"never\");'>" + gs("Never...") + "</button>";
	b += createNeverMenu(0, 2);
	b += experimentaloverlay ? "<button type='button' lptype='generate' id='lpgenerate' class='lpbutton' value='" + gs("Generate") + "'>" + gs("Generate") + "</button>" : "<button type='button' lptype='generate' id='lpgenerate' class='lpbutton' value='" + gs("Generate") + "' onclick='this.dispatchEvent(lpcustomEvent);'>" + gs("Generate") + "</button>";
	if (a.extra3) {
		var c = getcount(g_sites);
		if (c > 0) {
			b += experimentaloverlay ? "<button type='button' id='lpfillcurrent' class='lpbutton' value='" + gs("Fill Current") + " (" + c + ")'>" + gs("Fill Current") + " (" + c + ")</button>" : "<button type='button' id='lpfillcurrent' class='lpbutton' value='" + gs("Fill Current") + " (" + c + ")' onclick='lpshowmenudiv(\"fillcurrent\");'>" + gs("Fill Current") + " (" + c + ")</button>";
			b += createMenu("fillcurrent", g_sites, c)
		}
	}
	if (experimentaloverlay)
		if (a.extra2) {
			c = getcount(g_formfills);
			if (c > 0)
				if (alwayschooseprofilecc)
					b += experimentaloverlay ? "<button type='button' lptype='chooseprofilecc' id='lpchooseprofilecc' class='lpbutton' value='" + gs("Fill Form") + " (" + c + ")'>" + gs("Fill Form") + " (" + c + ")</button>" : "<button type='button' lptype='chooseprofilecc' id='lpchooseprofilecc' class='lpbutton' value='" + gs("Fill Form") + " (" + c + ")' onclick='this.dispatchEvent(lpcustomEvent);'>" + gs("Fill Form") + " (" + c + ")</button>";
				else {
					b += experimentaloverlay ? "<button type='button' id='lpfillform' class='lpbutton' value='" + gs("Fill Form") + " (" + c + ")'>" + gs("Fill Form") + " (" + c + ")</button>" : "<button type='button' id='lpfillform' class='lpbutton' value='" + gs("Fill Form") + " (" + c + ")' onclick='lpshowmenudiv(\"fillform\");'>" + gs("Fill Form") + " (" + c + ")</button>";
					b += createMenu("fillform", g_formfills, getcount(g_formfills))
				}
		}
	createGenerateFormFillListener();
	return b
}
function createFormFillButtons() {
	var a = "";
	a += experimentaloverlay ? "<button type='button' id='lpnever' class='lpbutton' value='" + gs("Never...") + "'>" + gs("Never...") + "</button>" : "<button type='button' id='lpnever' class='lpbutton' value='" + gs("Never...") + "' onclick='lpshowmenudiv(\"never\");'>" + gs("Never...") + "</button>";
	a += createNeverMenu(0, 3);
	if (alwayschooseprofilecc)
		a += experimentaloverlay ? "<button type='button' lptype='chooseprofilecc' id='lpchooseprofilecc' class='lpbutton' value='" + gs("Fill Form") + " (" + getcount(g_formfills) + ")'>" + gs("Fill Form") + " (" + getcount(g_formfills) + ")</button>" : "<button type='button' lptype='chooseprofilecc' id='lpchooseprofilecc' class='lpbutton' value='" + gs("Fill Form") + " (" + getcount(g_formfills) + ")' onclick='this.dispatchEvent(lpcustomEvent);'>" + gs("Fill Form") + " (" + getcount(g_formfills) + ")</button>";
	else {
		a += experimentaloverlay ? "<button type='button' id='lpfillform' class='lpbutton' value='" + gs("Fill Form") + " (" + getcount(g_formfills) + ")'>" + gs("Fill Form") + " (" + getcount(g_formfills) + ")</button>" : "<button type='button' id='lpfillform' class='lpbutton' value='" + gs("Fill Form") + " (" + getcount(g_formfills) + ")' onclick='lpshowmenudiv(\"fillform\");'>" + gs("Fill Form") + " (" + getcount(g_formfills) + ")</button>";
		a += createMenu("fillform", g_formfills, getcount(g_formfills))
	}
	createGenerateFormFillListener();
	return a
}
function createGenerateFormFillListener() {
	experimentaloverlay || document.addEventListener("lpCustomEventMenu", function(a) {
		var b = a.srcElement.getAttribute("lptype");
		if (b != "fillform")
			if (b != "addprofile")
				if (b == "addcreditcard") {
					sendBG({
						cmd : "addcreditcard"
					});
					document.getElementById("lppopupfillform").style.display = "none"
				} else if (b == "clearforms") {
					sendBG({
						cmd : "clearforms"
					});
					document.getElementById("lppopupfillform").style.display = "none"
				} else if (b != "chooseprofilecc")
					if (b == "fillcurrent") {
						sendBG({
						cmd : "fillcurrentaid",
						aid : a.srcElement.getAttribute("aid")
						});
						document.getElementById("lppopupfillcurrent").style.display = "none"
					} else if (b == "generate") {
						sendBG({
							cmd : "generate"
						});
						if (!document.getElementById("lppopupfillform") && !document.getElementById("lppopupfillcurrent"))
							document.getElementById("lastpass-notification").style.display = "none"
					} else if (b == "neverpage" || b == "neverdomain") {
						a = {
						cmd : b,
						url : punycode.URLToASCII(document.location.href)
						};
						if (document.getElementById("lpgenerate"))
							a.fromgenerate = 1;
						else
							a.fromformfill = 1;
						sendBG(a);
						document.getElementById("lppopupnever").style.display = "none";
						document.getElementById("lastpass-notification").style.display = "none"
					}
	}, false)
}
function getAutoFillArray(a) {
	var b = [], c = punycode.URLToASCII(document.location.href);
	lpcanonizeUrl(c);
	for ( var e in a)
		a[e].genpw || (b[e] = a[e]);
	return b
}
function getAutoLoginArray(a) {
	var b = [], c;
	for (c in a)
		typeof a[c].fields == "undefined" || getcount(a[c].fields) == 0 || !canFindForm(a[c].fields) || (b[c] = a[c]);
	return b
}
function canFindForm(a) {
	for ( var b = document.getElementsByTagName("form"), c = 0; c < b.length; c++) {
		var e = [], d;
		for (d in a)
			if ("text" == a[d].type || "password" == a[d].type || "email" == a[d].type)
				e[a[d].type + a[d].name] = 0;
		var g = false, k = b[c].elements, n = [];
		for (d = 0; d < k.length; d++) {
			var o = k[d];
			if ("text" == o.type || "email" == o.type || "password" == o.type) {
				if (typeof e[o.type + o.name] != "undefined")
					e[o.type + o.name] = 1;
				if (o.type == "password")
					g = true;
				n[o.type + o.name] = 0
			}
		}
		for (d in a)
			if ("text" == a[d].type || "password" == a[d].type || "email" == a[d].type)
				if (typeof n[a[d].type + a[d].name] != "undefined")
					n[a[d].type + a[d].name] = 1;
		if (g) {
			g = true;
			for (d in e)
				if (e[d] == 0) {
					g = false;
					break
				}
			e = true;
			for (d in n)
				if (n[d] == 0) {
					e = false;
					break
				}
			if (g || e)
				return true
		}
	}
	return false
}
function createMenu(a, b, c) {
	var e = "", d = "", g = 0, k = false, n = false, o = c;
	if (a == "fillform") {
		c > 0 && o++;
		o += 3;
		for ( var f in g_formfills) {
			if (g_formfills[f].profiletype == 0)
				k = true;
			if (g_formfills[f].ccnum != "")
				n = true
		}
		k && n && o++
	}
	if (a == "autofill" || a == "autologin") {
		g = 1;
		o += 2
	}
	if (experimentaloverlay)
		d = o < 7 ? " style='height:" + o * 24 + "px'" : " style='height: 170px; overflow:auto;'";
	else if (o < 12)
		d = " style='height:" + o * 24 + "px'";
	if (g == 1) {
		e += "<div " + g_opera_selectable + "id='lppopup" + a + "' class='lppopupextended' " + d + ">";
		e += "<TABLE WIDTH='100%' ><TR CLASS='lppopupsearchbox' WIDTH='100%' ID='";
		e += a + "tabfooter'> <TD ID='";
		e += a + "tabsearchlabel'>";
		e += gs(a) + " " + gs("Filter") + ": <INPUT ID='";
		if (experimentaloverlay) {
			e += a + "tabsearchbox' TYPE=\"TEXT\"><IMG ID='";
			e += a + "tabsearchboxreset' ALT='reset'></TD>"
		} else {
			e += a + 'tabsearchbox\' TYPE="TEXT" lptype="' + a + 'tabsearchbox" ONKEYUP="this.dispatchEvent(lpcustomEvent);"><IMG ID=\'';
			e += a + "tabsearchboxreset' ALT='reset' SRC='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABX0lEQVR42qXTsWrCUBTGcaFroZNTwQfo1KnQN3CQblLIkD2CFIqbaEBQsGAIJBAaCIoQI4JKoeADFDpVmuCsUyE4FJyznJ4vSEjkKgWFH4R7cv/RS8zNZjORO/bMXDZkT+xWdO/hwtV+E02n0wxeg1d2eSxQYD+TyYRc1xXiGSIblhcFPnGT4zgnjUYjRBaHgaLneWSa5r+Mx2NE7tOBvmVZ1O12Y8vlkqIoovl8ToPBANdYS+a2bSPwkg58YNBsNhNBENB2uwVcZ2a9Xg+Bt0yg1WpRrVZLNBoNPBlwnZm1220E3tOBIQKKoiRWqxWFYRhbr9eZWafTQcBIBx4NwyBZlmO+79Nut8OTAd8Ca8kc54WDTwcu2He9XqdyuXySqqqEnyx6D27YLyKlUkkEB4jNISuIAnDNFpqmUaVSIUmSYtVqlXRdx2Z88uJXOeuBuexrr8+Kx/5MZ8kR0Vn+AGczfuZVuZDxAAAAAElFTkSuQmCC' lptype=\"" + a + 'tabsearchboxreset" ONCLICK="this.dispatchEvent(lpcustomEvent);"></TD>'
		}
		e += "</TR>\n";
		e += "</TABLE>\n";
		e += "<TABLE id='" + a + "tab' class='sortable' width='100%'>\n";
		e += "<THEAD WIDTH='100%' ><TR ID='";
		e += a + 'tabheader\'><TH MIN-WIDTH="10ems">';
		e += a == "fillform" ? gs("Form Fill Profiles").toUpperCase() : gs("SITE").toUpperCase();
		e += '</TH><TH MIN-WIDTH="10ems">';
		e += gs("Username").toUpperCase() + "</TH><TH MIN-WIDTH='14ems'>";
		e += gs("Last Touch").toUpperCase() + "</TH></TR></THEAD>\n";
		e += "<TBODY WIDTH='100%'>\n"
	} else
		e += "<div " + g_opera_selectable + "id='lppopup" + a + "' class='lppopup' " + d + "><table width='100%'>";
	for (f in b) {
		o = "";
		if (a != "fillform" && b[f].useusername != "")
			o = " (" + ofa(b[f].useusername) + ")";
		d = a == "fillform" ? "ffid" : "aid";
		if (g == 1) {
			o = "";
			if (typeof b[f].last_touch != "undefined")
				o = ofa_pretty_print_tabular_last_touch(b[f].last_touch);
			var r = "";
			if (typeof b[f].useusername != "undefined")
				r = ofa_pretty_print_tabular_username(b[f].useusername);
			var q = "";
			if (a == "fillform") {
				if (typeof b[f].decprofilename != "undefined")
					q = ofa_pretty_print_tabular_formfill(b[f].decprofilename)
			} else if (typeof b[f].name != "undefined")
				q = ofa_pretty_print_tabular_sitename(b[f].name);
			if (experimentaloverlay)
				e += "<tr width='100%' id='lp" + a + b[f][d] + "'><td " + g_opera_selectable + ">&nbsp;" + q + "</TD><TD>" + r + "</TD>";
			else {
				e += "<tr width='100%'  lptype='" + a + "' id='lp" + a + b[f][d] + "' ONCLICK='this.dispatchEvent(lpcustomEvent);' ";
				e += d + '="' + b[f][d] + '"';
				e += "><td " + g_opera_selectable + ">&nbsp;" + ofa(b[f][a == "fillform" ? "decprofilename" : "name"]) + "</TD><TD>" + r + "</TD>"
			}
			e += "<TD sorttable_customkey='" + ofa(b[f].last_touch) + "'>" + o + "</td></tr>"
		} else
			e += experimentaloverlay ? "<tr id='lp" + a + b[f][d] + "'><td " + g_opera_selectable + ">&nbsp;" + ofa(b[f][a == "fillform" ? "decprofilename" : "name"]) + o + "</td></tr>" : "<tr lptype='" + a + "' " + d + '="' + b[f][d] + "\" onclick='this.dispatchEvent(lpcustomEvent);'><td " + g_opera_selectable + ">&nbsp;" + ofa(b[f][a == "fillform" ? "decprofilename" : "name"]) + o + "</td></tr>"
	}
	if (g == 1)
		e += "</TBODY>\n";
	if (a == "fillform") {
		if (c > 0)
			e += "<tr style='background-color: #fff;'><td><hr></td></tr>";
		e += experimentaloverlay ? "<tr lptype='addprofile' id='lpaddprofile'><td " + g_opera_selectable + ">&nbsp;" + gs("Add Profile") + "</td></tr>" : "<tr lptype='addprofile' onclick='this.dispatchEvent(lpcustomEvent)'><td " + g_opera_selectable + ">&nbsp;" + gs("Add Profile") + "</td></tr>";
		e += experimentaloverlay ? "<tr lptype='addcreditcard' id='lpaddcreditcard'><td " + g_opera_selectable + ">&nbsp;" + gs("Add Credit Card") + "</td></tr>" : "<tr lptype='addcreditcard' onclick='this.dispatchEvent(lpcustomEvent)'><td " + g_opera_selectable + ">&nbsp;" + gs("Add Credit Card") + "</td></tr>";
		e += experimentaloverlay ? "<tr lptype='clearforms' id='lpclearforms'><td " + g_opera_selectable + ">&nbsp;" + gs("Clear Forms") + "</td></tr>" : "<tr lptype='clearforms' onclick='this.dispatchEvent(lpcustomEvent)'><td " + g_opera_selectable + ">&nbsp;" + gs("Clear Forms") + "</td></tr>";
		if (k && n)
			e += experimentaloverlay ? "<tr lptype='chooseprofilecc' id='lpchooseprofilecc'><td " + g_opera_selectable + ">&nbsp;" + gs("Choose Profile and Credit Card") + "</td></tr>" : "<tr lptype='chooseprofilecc' onclick='this.dispatchEvent(lpcustomEvent);'><td " + g_opera_selectable + ">&nbsp;" + gs("Choose Profile and Credit Card") + "</td></tr>"
	}
	e += "</table></div>";
	addMenuIdToPage(a);
	return e
}
function createNeverMenu(a) {
	var b = "";
	b += "<div id='lppopupnever' class='lppopup' " + (" style='height:" + (a ? "72" : "48") + "px'") + "><table width='100%'>";
	if (a)
		b += experimentaloverlay ? "<tr lptype='neverautofill' id='lpneverautofill'><td>&nbsp;" + gs("Never AutoFill") + "</td></tr>" : "<tr lptype='neverautofill' onclick='this.dispatchEvent(lpcustomEvent);'><td>&nbsp;" + gs("Never AutoFill") + "</td></tr>";
	b += experimentaloverlay ? "<tr lptype='neverpage' id='lpneverpage'><td>&nbsp;" + gs("Never For This Page") + "</td></tr>" : "<tr lptype='neverpage' onclick='this.dispatchEvent(lpcustomEvent);'><td>&nbsp;" + gs("Never For This Page") + "</td></tr>";
	b += experimentaloverlay ? "<tr lptype='neverdomain' id='lpneverdomain'><td>&nbsp;" + gs("Never For This Domain") + "</td></tr>" : "<tr lptype='neverdomain' onclick='this.dispatchEvent(lpcustomEvent);'><td>&nbsp;" + gs("Never For This Domain") + "</td></tr>";
	b += "</table></div>";
	addMenuIdToPage("never");
	return b
}
function addMenuIdToPage(a) {
	run_custom_js(document, "if(typeof(lpgblmenus)=='undefined'){ lpgblmenus = new Array(); }   lpgblmenus[lpgblmenus.length] = 'lppopup" + a + "';   ")
}
function checkForLoginForm(a) {
	var b = lp_gettld_url(punycode.URLToASCII(a.location.href));
	a = a.getElementsByTagName("form");
	for ( var c = 0; c < a.length; c++) {
		for ( var e = 0, d = a[c].elements, g = 0; g < d.length; g++) {
			var k = d[g];
			if (k.type == "password")
				if (!(b == "facebook.com" && typeof k.id == "string" && k.id.match(/^[a-z0-9]{6}_\d{1,2}_ci_password$/)))
					if (g_fillaid)
						return true;
					else if (++e >= 2)
						return false
		}
		if (e == 1)
			return true
	}
	return false
}
function lp_notification_exists(a, b) {
	return b == curr_notification_type || b == "autologin" && curr_notification_type == "fill"
}
function never_gen() {
	return false
}
function never_ff() {
	return false
}
function lp_showNotification(a, b, c, e, d, g, k, n) {
	lpshownotification(e, {
	text : gs(a),
	aid : c,
	extra : d,
	extra2 : k,
	extra3 : n
	})
}
if (typeof g_is_formfill == "undefined")
	if (g_isopera)
		window.addEventListener("DOMContentLoaded", function() {
			onLoad()
		}, false);
	else
		g_ischrome ? window.addEventListener("DOMContentLoaded", function() {
			onLoad()
		}, false) : onLoad();
function lpgettop() {
	return g_isopera ? window.top : top
}
function lpgettopurl() {
	try {
		return punycode.URLToASCII(lpgettop().document.location.href)
	} catch (a) {
		return punycode.URLToASCII(document.location.href)
	}
}
function createContextMenu(a) {
	var b = "<div id='contextmain' class='lppopup' style='display:block'><table width='" + g_contextwidth + "px' style='border:1px inset;'>";
	b += "<tr><td onclick='showcontext(0)'>" + gs("AutoFill") + " <img style='float:right' src='arrow.png'/></td>";
	if (typeof a.can_copy != "undefined" && a.can_copy) {
		b += "<tr><td onclick='showcontext(1)'>" + gs("Copy Username") + " <img style='float:right' src='arrow.png'/></td>";
		b += "<tr><td onclick='showcontext(2)'>" + gs("Copy Password") + " <img style='float:right' src='arrow.png'/></td>";
		b += "<tr><td onclick='showcontext(5)'>" + gs("Copy URL") + " <img style='float:right' src='arrow.png'/></td>"
	}
	b += "<tr><td onclick='recheckpage()'>" + gs("Recheck Page") + "</td>";
	b += "<tr><td onclick='generate()'>" + gs("Generate Secure Password") + "</td>";
	b += "<tr><td onclick='showcontext(3)'>" + gs("Fill Forms") + " <img style='float:right' src='arrow.png'/></td>";
	b += "</tr></table></div>";
	b += "<div id='contextsub' class='lppopup' style='display:none;height:" + g_contextheight + "px;width:" + g_contextwidth + "px;overflow-x: hidden;'><table width='" + g_contextwidth + "px' style='border:1px inset;'>";
	var c = getAutoFillArray(LPJSON.parse(a.sites));
	if (getcount(c) == 0)
		b += "<tr><td onclick='hidecontext()'>No Matching Sites!</td></tr>";
	for ( var e in c) {
		var d = c[e].useusername;
		b += "<tr><td onclick='docontextaction(\"" + ofa(c[e].aid) + "\")'>" + trunc2(c[e].name, d, g_contextwidth - 40) + "</td></tr>"
	}
	b += "</tr></table></div>";
	b += "<div id='contextff' class='lppopup' style='display:none;height:" + g_contextheight + "px;width:" + g_contextwidth + "px;overflow-x: hidden;'><table width='" + (g_contextwidth - 10) + "px' style='border:1px inset;'>";
	a = LPJSON.parse(a.formfills);
	getcount(g_formfills);
	for (e in a)
		b += "<tr><td onclick='showcontext(4, \"" + ofa(a[e].ffid) + "\")'>" + trunc2(a[e].decprofilename, "", g_contextwidth - 60) + " <img style='float:right' src='arrow.png'/></td></tr>";
	b += "<tr><td onclick='addprofile();'>" + gs("Add Profile") + "</td>";
	b += "<tr><td onclick='addcc();'>" + gs("Add Credit Card") + "</td>";
	b += "<tr><td onclick='clearforms();'>" + gs("Clear Forms") + "</td>";
	b += "<tr><td onclick='chooseprofilecc();'>" + gs("Choose Profile and Credit Card") + "</td>";
	b += "</tr></table></div>";
	b += "<div id='contextffsub' class='lppopup' style='display:none;height:" + g_contextheight + "px;'><table width='" + g_contextwidth + "px' style='border:1px inset;'>";
	b += "<tr><td onclick='ffsub(0)'>" + gs("Fill Form") + "</td>";
	b += "<tr><td onclick='ffsub(1)'>" + gs("Edit") + "</td>";
	b += "</tr></table></div>";
	return b
}
function trunc2(a, b, c) {
	var e = document.getElementById("gettextextent");
	if (!e) {
		e = document.createElement("span");
		e.id = "gettextextent";
		e.style.cssText = "display:block;position:absolute;top:-100px;left:1000px;font-size:11px;font-family:Helvetica Neue,Helvetica,Arial, sans-serif;";
		document.body && document.body.appendChild(e)
	}
	var d = ofa(a) + (b.length ? " (" + ofa(b) + ")" : "");
	for (e.innerHTML = d; e.offsetWidth > c;) {
		a = a.length ? a.substr(0, a.length - 1) : "";
		b = b.length > 3 ? b.substr(0, b.length - 3) : "";
		d = ofa(a) + ".." + (b.length ? " (" + ofa(b) + "..)" : "");
		e.innerHTML = d
	}
	return d
}
var g_searchfillbox = null, g_searchloginbox = null, g_searchformfillbox = null;
function clear_searchbox(a) {
	var b;
	if (a == "autofill")
		b = g_searchfillbox;
	else if (a == "autologin")
		b = g_searchloginbox;
	else
		return;
	if (b != null) {
		b.value = "";
		for ( var c = document.getElementsByTagName("tr"), e = 0; e < c.length; e++) {
			var d = c[e].id;
			if (d.indexOf("lp" + a) == 0) {
				d = document.getElementById(d);
				if (d.style.display != "table-row")
					d.style.display = "table-row"
			}
		}
		a = document.getElementById(a + "footer");
		if (a != null)
			a.className = "lppopupsearchbox";
		b.focus()
	}
}
function dofilter(a) {
	var b;
	if (a == "autofill")
		b = g_searchfillbox;
	else if (a == "autologin")
		b = g_searchloginbox;
	else if (a == "fillform")
		b = g_searchfillformbox;
	else
		return;
	if (b != null) {
		a = document.getElementById(a + "tab");
		b = b.value.toLowerCase();
		sorttable.filter(a, b)
	}
}
function initialize_sorttable() {
	sorttable.init();
	var a = document.getElementById("autofilltab");
	a != null && sorttable.initial_sort(a.tHead.rows[0].cells[2]);
	a = document.getElementById("autologintab");
	a != null && sorttable.initial_sort(a.tHead.rows[0].cells[2]);
	a = document.getElementById("fillformtab");
	a != null && sorttable.initial_sort(a.tHead.rows[0].cells[2]);
	g_searchfillbox = document.getElementById("autofilltabsearchbox");
	g_searchloginbox = document.getElementById("autologintabsearchbox");
	g_searchfillformbox = document.getElementById("fillformtabsearchbox")
}
function chk_should_close_exttable(a) {
	var b = [ "autologintab", "autologintabfooter", "autologintabheader", "autologintabsearchlabel", "autofilltab", "autofilltabfooter", "autofilltabheader", "autofilltabsearchlabel", "fillformtab", "fillformtabfooter", "fillformtabheader", "fillformtabsearchlabel", "sorttable_sortrevind", "sorttable_sortfwdind" ], c = null, e = null;
	if (typeof a.target != "undefined") {
		c = a.target.id;
		if (typeof a.target.parentElement != "undefined" && a.target.parentElement != null)
			e = a.target.parentElement.id
	}
	a = false;
	for ( var d in b) {
		if (c != null && c == b[d]) {
			a = true;
			break
		}
		if (e != null && e == b[d]) {
			a = true;
			break
		}
	}
	return !a
}
function ofa_pretty_print_truncate(a) {
	var b = "";
	return b = a == null && a.length <= 0 ? "" : a.length < 5 ? ofa(a) : ofa(a.substring(0, 2)) + ELLIPSIS_CODE + ofa(a.substring(a.length - 2))
}
function ofa_pretty_print_tabular_last_touch(a) {
	if (a == "" || a == null)
		a = 0;
	return ofa(elapsedTime(a))
}
function ofa_pretty_print_tabular_username(a) {
	var b = "";
	if (a != "" && a != null)
		b = a.length > 25 ? ofa(a.substring(0, 24)) + ELLIPSIS_CODE : ofa(a);
	return b
}
function ofa_pretty_print_tabular_formfill(a) {
	var b = "";
	if (a != "" && a == null)
		b = fillnamee.length > 25 ? ofa(a.substring(0, 24)) + ELLIPSIS_CODE : ofa(a);
	return b
}
function ofa_pretty_print_tabular_sitename(a) {
	var b = "";
	if (a != "" && a != null)
		if (a.length > 25) {
			a = a.split(".");
			b = a.length;
			if (b > 3)
				if (a[b - 1].length + a[b - 2].length + a[0].length + 2 < 25)
					a = [ ofa(a[0]) + ELLIPSIS_CODE, ofa(a[b - 2]), ofa(a[b - 1]) ];
				else
					for (b = 0; b < a.length; b++)
						a[b] = a[b].length > 15 ? ofa_pretty_print_truncate(a[b]) : ofa(a[b]);
			else
				for (b = 0; b < a.length; b++)
					a[b] = a[b].length > 15 ? ofa_pretty_print_truncate(a[b]) : ofa(a[b]);
			b = a.join(".")
		} else
			b = ofa(a);
	return b
}
var lpParseUriCache = [], lpParseUriNumber = 0;
function lpParseUri(a) {
	if (typeof a != "string")
		return "";
	if (lpParseUriCache[a] != null)
		return lpParseUriCache[a];
	var b = null, c = null, e = a;
	if (a.indexOf("#") != -1) {
		c = a.substring(a.indexOf("#") + 1);
		a = a.substring(0, a.indexOf("#"))
	}
	if (a.indexOf("?") != -1) {
		b = a.substring(a.indexOf("?") + 1);
		a = a.substring(0, a.indexOf("?"))
	}
	var d = a.match(/^(.*:\/\/[^\/]+\/.*)@/);
	if (d)
		a = a.substring(0, d[1].length) + a.substring(d[1].length).replace(/@/g, "%40");
	if (a.length > 2047)
		return "";
	var g = lpParseUri.options;
	d = null;
	try {
		d = g.parser[g.strictMode ? "strict" : "loose"].exec(a)
	} catch (k) {
		try {
			d = a.length > 500 ? g.parser[g.strictMode ? "strict" : "loose"].exec(a.substr(0, 500)) : g.parser[g.strictMode ? "strict" : "loose"].exec(a.substr(0, floor(a.length / 2)))
		} catch (n) {
			lpReportError("parseuri : failing " + a);
			d = g.parser[g.strictMode ? "strict" : "loose"].exec("http://")
		}
	}
	a = d;
	var o = {};
	for (d = 14; d--;)
		o[g.key[d]] = a[d] || "";
	o[g.q.name] = {};
	o[g.key[12]].replace(g.q.parser, function(r, q, x) {
		if (q)
			o[g.q.name][q] = x
	});
	if (b != null) {
		o.query = b;
		if (c != null)
			o.anchor = c
	}
	if (lpParseUriNumber > 500) {
		for ( var f in lpParseUriCache) {
			delete lpParseUriCache[f];
			break
		}
		lpParseUriNumber = 0
	}
	lpParseUriCache[e] = o;
	lpParseUriNumber++;
	return o
}
lpParseUri.options = {
strictMode : false,
key : [ "source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor" ],
q : {
name : "queryKey",
parser : /(?:^|&)([^&=]*)=?([^&]*)/g
},
parser : {
strict : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
loose : /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
}
};
var lpCanUrlCache = [], lpCanUrlExNumber = 0;
function lpcanonizeUrl(a, b) {
	if ("about:blank" == a)
		return "";
	if (lpCanUrlCache[a] != null)
		return lpCanUrlCache[a];
	if (b == null)
		b = lpParseUri(a);
	var c = "";
	if (b.port != "")
		if (b.port != get_default_port(b.protocol))
			c = ":" + b.port;
	if (b.host)
		c = b.host.toLowerCase() + c + b.path;
	else {
		if (!a)
			return "";
		c = a
	}
	if (c.indexOf(";") != -1)
		c = c.substring(0, c.indexOf(";"));
	if (lpCanUrlExNumber > 500) {
		for ( var e in lpCanUrlCache) {
			delete lpCanUrlCache[e];
			break
		}
		lpCanUrlExNumber = 0
	}
	lpCanUrlCache[a] = c;
	lpCanUrlExNumber++;
	return c
}
function lp_gettld(a, b) {
	if (typeof lp_all_tlds == "undefined" || lp_all_tlds == null)
		lp_init_tlds();
	if (typeof a != "string")
		return "";
	if (a == "" && typeof b == "string" && b.indexOf("file://") == 0)
		return "file:";
	a = a.toLowerCase();
	a = a.replace(/\.$/, "");
	var c = a.split("."), e;
	if (a.match(/^\d+\.\d+\.\d+\.\d+$/))
		e = 4;
	else {
		e = 2;
		if (c.length >= 2) {
			var d = c[c.length - 1];
			if (typeof lp_all_tlds[d] != "undefined")
				if (lp_in_array(c[c.length - 2], lp_all_tlds[d]))
					e = 3
		}
	}
	for (; c.length > e;)
		c.shift();
	return c.join(".")
}
function lp_gettld_url(a) {
	var b = lpParseUri(a);
	return lp_gettld(b.host, a)
}
function getname_url(a) {
	a = lpParseUri(punycode.URLToUnicode(a));
	return (typeof a.host == "string" ? a.host : "").replace(/^www\./, "")
}
function lptrim(a) {
	if (typeof a != "string")
		return a;
	return a.replace(/^\s+|\s+$/g, "")
}
function lp_regexp_quote(a) {
	return (a + "").replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!<>\|\:])/g, "\\$1")
}
function getname(a, b) {
	if (b && typeof a.id != "undefined" && a.id != "")
		return a.id;
	if (typeof a != "undefined" && a != null)
		if (typeof a.name != "undefined" && a.name != "")
			return a.name;
		else if (typeof a.id != "undefined")
			return a.id;
	return ""
}
function lpIsVisible(a, b) {
	for (; a && a.tagName != "BODY"; a = a.parentNode) {
		if (typeof a.style != "undefined" && (a.style.visibility == "hidden" || a.style.display == "none"))
			return false;
		try {
			var c = a.ownerDocument.defaultView.getComputedStyle(a, "");
			if (c.visibility == "hidden" || c.display == "none")
				return false
		} catch (e) {
		}
		if (b)
			break
	}
	return true
}
function lp_in_array(a, b) {
	for ( var c = b.length, e = 0; e <= c; e++)
		if (typeof b[e] != "undefined" && b[e] == a) {
			lpArrayOffset = e;
			return true
		}
	return false
}
function strip(a) {
	if (!a.length)
		return a;
	a = a.replace(/\s+/g, " ");
	a = a.replace(/^\s+|\s+$/g, "");
	a = a.replace(/[\|]+$/g, "");
	var b = a.match(/\|([^\|]+)$/);
	if (b) {
		a = b[1];
		a = a.replace(/^\s+|\s+$/g, "")
	}
	return a
}
function lpxmlescape(a) {
	if (typeof a == "number")
		a = "" + a;
	a = a.replace(/&/g, "&amp;");
	a = a.replace(/</g, "&lt;");
	a = a.replace(/>/g, "&gt;");
	return a.replace(/"/g, "&quot;")
}
function lpxmlunescape(a) {
	if (typeof a == "number")
		a = "" + a;
	a = a.replace(/&lt;/g, "<");
	a = a.replace(/&gt;/g, ">");
	a = a.replace(/&quot;/g, '"');
	return a.replace(/&amp;/g, "&")
}
var lpRegExCache = [], lpRegExNumber = 0;
function regexp_match_c(a, b) {
	var c = a.toString() + "_" + b;
	if (c.length > 80)
		if (typeof fasthash == "function")
			c = fasthash(c);
		else if (typeof SHA256 == "function")
			c = SHA256(c);
	if (lpRegExCache[c] != null)
		return lpRegExCache[c] == "1";
	var e = a.exec(b);
	if (lpRegExNumber > 2500) {
		for ( var d in lpRegExCache) {
			delete lpRegExCache[d];
			break
		}
		lpRegExNumber = 0
	}
	lpRegExCache[c] = e ? "1" : "0";
	lpRegExNumber++;
	return e
}
function fire_onchange(a, b) {
	try {
		if (a) {
			if (a.ownerDocument && typeof a.ownerDocument.createEvent == "function") {
				var c = a.ownerDocument.createEvent("Events");
				c.initEvent("change", true, true);
				a.dispatchEvent(c)
			} else
				typeof a.fireEvent != "undefined" && a.fireEvent("onchange");
			if (typeof b == "undefined" || b == null || b)
				typeof sendKey == "function" && sendKey("SHIFT", a);
			if (typeof lpGetBrowserForDocument == "function") {
				var e = lpGetBrowserForDocument(a.ownerDocument);
				if (e)
					e.lpfieldchanged = true
			}
		}
	} catch (d) {
	}
}
function get_default_port(a) {
	switch (a) {
	case "http":
		return 80;
	case "https":
		return 443;
	case "ftp":
		return 21;
	default:
		return 0
	}
}
function get_port(a) {
	var b = 0;
	if (typeof a.port != "undefined" && a.port)
		b = a.port;
	else if (typeof a.protocol != "undefined" && a.protocol)
		b = get_default_port(a.protocol);
	return b
}
function compare_ports(a, b) {
	var c = a.port != "" ? a.port : get_default_port(a.protocol), e = b.port != "" ? b.port : get_default_port(b.protocol);
	return c == e
}
function array_size(a) {
	var b = a.length ? --a.length : -1, c;
	for (c in a)
		b++;
	return b
}
function lpgetlocalts() {
	return (new Date).getTime()
}
function lp_get_gmt_timestamp() {
	var a = (new Date).getTime();
	return parseInt(a / 1E3)
}
function lp_get_local_timestamp() {
	return lp_get_gmt_timestamp()
}
function lp_init_tlds() {
	if (typeof lp_all_tlds == "undefined" || lp_all_tlds == null) {
		lp_all_tlds = [];
		lp_all_tlds.hu = [ "2000", "agrar", "bolt", "casino", "city", "co", "com", "erotica", "erotika", "film", "forum", "games", "hotel", "info", "ingatlan", "jogasz", "konyvelo", "lakas", "media", "news", "nui", "org", "priv", "reklam", "sex", "shop", "sport", "suli", "szex", "tm", "tozsde", "utazas", "video" ];
		lp_all_tlds.nl = [ "752" ];
		lp_all_tlds.ca = [ "ab", "bc", "gc", "mb", "nb", "nf", "nl", "ns", "nt", "nu", "on", "pe", "qc", "sk", "yk" ];
		lp_all_tlds.pa = [ "abo", "ac", "com", "edu", "gob", "ing", "med", "net", "nom", "org", "sld" ];
		lp_all_tlds.se = [ "ab", "ac", "bd", "brand", "com", "c", "d", "e", "fh", "fhsk", "fhv", "f", "g", "h", "i", "komforb", "kommunalforbund", "komvux", "k", "lanarb", "lanbib", "mil", "m", "naturbruksgymn", "net", "n", "org", "o", "parti", "pp", "press", "s", "sshn", "tm", "t", "u", "w", "x", "y", "z" ];
		lp_all_tlds.ac = [ "ac", "co", "com", "edu", "gov", "gv", "mil", "net", "or", "org" ];
		lp_all_tlds.ae = [ "ac", "com", "gov", "mil", "name", "net", "org", "pro", "sch" ];
		lp_all_tlds.at = [ "ac", "co", "gv", "or", "priv" ];
		lp_all_tlds.be = [ "ac", "ap", "co", "com", "fgov", "to", "xa" ];
		lp_all_tlds.cn = [ "ac", "ah", "bj", "com", "cq", "edu", "fj", "gd", "gov", "gs", "gx", "gz", "ha", "hb", "he", "hi", "hk", "hl", "hn", "jl", "js", "jx", "ln", "mo", "net", "nm", "nx", "org", "qh", "sc", "sd", "sh", "sn", "sx", "tj", "tw", "xj", "xz", "yn", "zj" ];
		lp_all_tlds.cr = [ "ac", "co", "ed", "fi", "go", "or", "sa" ];
		lp_all_tlds.cy = [ "ac", "biz", "com", "ekloges", "gov", "info", "ltd", "name", "net", "org", "parliament", "press", "pro", "tm" ];
		lp_all_tlds.fj = [ "ac", "biz", "com", "gov", "id", "info", "mil", "name", "net", "org", "pro", "school" ];
		lp_all_tlds.fk = [ "ac", "co", "gov", "net", "nom", "org" ];
		lp_all_tlds.gg = [ "ac", "alderney", "co", "gov", "guernsey", "ind", "ltd", "net", "org", "sark", "sch" ];
		lp_all_tlds.gn = [ "ac", "com", "gov", "net", "org" ];
		lp_all_tlds.gt = [ "com", "edu", "gob", "ind", "mil", "net", "org" ];
		lp_all_tlds.id = [ "ac", "co", "go", "mil", "net", "or", "sch", "web" ];
		lp_all_tlds.il = [ "ac", "co", "gov", "idf", "k12", "muni", "net", "org" ];
		lp_all_tlds.im = [ "ac", "co", "gov", "net", "nic", "org" ];
		lp_all_tlds["in"] = [ "ac", "co", "edu", "ernet", "firm", "gen", "gov", "ind", "mil", "net", "nic", "org", "res" ];
		lp_all_tlds.ir = [ "ac", "co", "gov", "net", "org", "sch" ];
		lp_all_tlds.is = [ "ac", "org" ];
		lp_all_tlds.je = [ "ac", "co", "gov", "ind", "jersey", "ltd", "net", "org", "sch" ];
		lp_all_tlds.jp = [ "ac", "ad", "aichi", "akita", "aomori", "chiba", "co", "ed", "ehime", "fukui", "fukuoka", "fukushima", "gifu", "go", "gov", "gr", "gunma", "hiroshima", "hokkaido", "hyogo", "ibaraki", "ishikawa", "iwate", "kagawa", "kagoshima", "kanagawa", "kawasaki", "kitakyushu", "kobe", "kochi", "kumamoto", "kyoto", "lg", "mie", "miyagi", "miyazaki", "nagano", "nagasaki", "nagoya", "nara", "ne", "net", "niigata", "oita", "okayama", "okinawa", "org", "or", "osaka", "saga", "saitama", "sapporo", "sendai", "shiga", "shimane", "shizuoka", "tochigi", "tokushima", "tokyo", "tottori", "toyama", "wakayama", "yamagata", "yamaguchi", "yamanashi", "yokohama" ];
		lp_all_tlds.kr = [ "ac", "co", "go", "ne", "nm", "or", "re" ];
		lp_all_tlds.mw = [ "ac", "com", "co", "coop", "edu", "gov", "int", "museum", "net", "org" ];
		lp_all_tlds.nz = [ "ac", "co", "cri", "geek", "gen", "govt", "iwi", "maori", "mil", "net", "org", "school" ];
		lp_all_tlds.ru = [ "ac", "com", "int", "msk", "net", "org", "pp" ];
		lp_all_tlds.rw = [ "ac", "com", "co", "edu", "gouv", "gov", "int", "mil", "net" ];
		lp_all_tlds.au = [ "act", "asn", "com", "conf", "csiro", "edu", "gov", "id", "info", "net", "nsw", "nt", "org", "oz", "qld", "sa", "tas", "telememo", "vic", "wa" ];
		lp_all_tlds.th = [ "ac", "co", "go", "in", "mi", "net", "or" ];
		lp_all_tlds.tj = [ "ac", "biz", "com", "co", "edu", "go", "gov", "int", "mil", "name", "net", "org", "web" ];
		lp_all_tlds.tz = [ "ac", "co", "go", "ne", "or" ];
		lp_all_tlds.ug = [ "ac", "co", "go", "ne", "or", "sc" ];
		lp_all_tlds.uk = [ "ac", "bl", "british-library", "com", "co", "gov", "icnet", "jet", "ltd", "me", "mil", "mod", "national-library-scotland", "nel", "net", "nhs", "nic", "nls", "org", "parliament", "plc", "police", "sch" ];
		lp_all_tlds.vn = [ "ac", "biz", "com", "edu", "gov", "health", "info", "int", "name", "net", "org", "pro" ];
		lp_all_tlds.yu = [ "ac", "co", "edu", "org" ];
		lp_all_tlds.za = [ "ac", "alt", "city", "com", "co", "edu", "gov", "law", "mil", "net", "ngo", "nom", "org", "school", "tm", "web" ];
		lp_all_tlds.zm = [ "ac", "co", "gov", "org", "sch" ];
		lp_all_tlds.zw = [ "ac", "co", "gov", "org" ];
		lp_all_tlds.br = [ "adm", "adv", "agr", "am", "arq", "art", "ato", "bio", "bmd", "cim", "cng", "cnt", "com", "coop", "dpn", "ecn", "edu", "eng", "esp", "etc", "eti", "far", "fm", "fnd", "fot", "fst", "g12", "ggf", "gov", "imb", "ind", "inf", "jor", "lel", "mat", "med", "mil", "mus", "net", "nom", "not", "ntr", "odo", "org", "ppg", "pro", "psc", "psi", "qsl", "rec", "slg", "srv", "tmp", "trd", "tur", "tv", "vet", "zlg" ];
		lp_all_tlds.ht = [ "adult", "art", "asso", "com", "coop", "edu", "firm", "gouv", "info", "med", "net", "org", "perso", "pol", "pro", "rel", "shop" ];
		lp_all_tlds.mv = [ "aero", "biz", "com", "coop", "edu", "gov", "info", "int", "mil", "museum", "name", "net", "org", "pro" ];
		lp_all_tlds.pl = [ "agro", "aid", "art", "atm", "auto", "bialystok", "biz", "com", "edu", "gdansk", "gda", "gmina", "gov", "gsm", "info", "krakow", "lodz", "lublin", "mail", "media", "miasta", "mil", "net", "ngo", "nom", "olsztyn", "org", "pc", "poznan", "priv", "realestate", "rel", "shop", "sklep", "slupsk", "sos", "szczecin", "targi", "tm", "torun", "tourism", "travel", "turystyka", "warszawa", "waw", "wroclaw", "wroc" ];
		lp_all_tlds.us = [ "ak", "al", "ar", "az", "ca", "com", "co", "ct", "dc", "de", "dni", "fed", "fl", "ga", "hi", "ia", "id", "il", "in", "isa", "kids", "ks", "ky", "la", "ma", "md", "me", "mi", "mn", "mo", "ms", "mt", "nc", "nd", "ne", "nh", "nj", "nm", "nsn", "nv", "ny", "oh", "ok", "or", "pa", "ri", "sc", "sd", "tn", "tx", "ut", "va", "vt", "wa", "wi", "wv", "wy" ];
		lp_all_tlds.fi = [ "aland" ];
		lp_all_tlds.mil = [ "army", "navy" ];
		lp_all_tlds["do"] = [ "art", "com", "edu", "gob", "gov", "mil", "net", "org", "sld", "web" ];
		lp_all_tlds.dz = [ "art", "asso", "com", "edu", "gov", "net", "org", "pol" ];
		lp_all_tlds.co = [ "arts", "com", "edu", "firm", "gov", "info", "int", "mil", "net", "nom", "org", "rec", "store", "uk", "web" ];
		lp_all_tlds.ro = [ "arts", "com", "firm", "info", "nom", "nt", "org", "rec", "store", "tm", "www" ];
		lp_all_tlds.ve = [ "arts", "bib", "com", "co", "edu", "firm", "gov", "info", "int", "mil", "net", "nom", "org", "rec", "store", "tec", "web" ];
		lp_all_tlds.lv = [ "asn", "com", "conf", "edu", "eu", "gov", "id", "mil", "net", "org" ];
		lp_all_tlds.lk = [ "assn", "com", "edu", "gov", "grp", "hotel", "int", "ltd", "net", "ngo", "org", "sch", "soc", "web" ];
		lp_all_tlds.fr = [ "asso", "com", "gouv", "nom", "prd", "presse", "tm" ];
		lp_all_tlds.gp = [ "asso", "com", "edu", "net", "org" ];
		lp_all_tlds.mc = [ "asso", "tm" ];
		lp_all_tlds.tr = [ "av", "bbs", "bel", "biz", "com", "dr", "edu", "gen", "gov", "info", "k12", "mil", "name", "net", "org", "pol", "tel", "web" ];
		lp_all_tlds.az = [ "biz", "com", "edu", "gov", "info", "int", "mil", "name", "net", "org", "pp" ];
		lp_all_tlds.et = [ "biz", "com", "edu", "gov", "info", "name", "net", "org" ];
		lp_all_tlds.nr = [ "biz", "com", "co", "edu", "gov", "info", "net", "org" ];
		lp_all_tlds.om = [ "biz", "com", "co", "edu", "gov", "med", "mil", "museum", "net", "org", "pro", "sch" ];
		lp_all_tlds.pk = [ "biz", "com", "edu", "fam", "gob", "gok", "gon", "gop", "gos", "gov", "net", "org", "web" ];
		lp_all_tlds.pr = [ "biz", "com", "edu", "gov", "info", "isla", "name", "net", "org", "pro" ];
		lp_all_tlds.tt = [ "biz", "com", "co", "edu", "gov", "info", "name", "net", "org", "pro", "us" ];
		lp_all_tlds.ua = [ "cherkassy", "chernigov", "chernovtsy", "ck", "cn", "com", "crimea", "cv", "dnepropetrovsk", "dn", "donetsk", "dp", "edu", "gov", "if", "ivano-frankivsk", "kharkov", "kherson", "khmelnitskiy", "kh", "kiev", "kirovograd", "km", "kr", "ks", "kv", "lg", "lugansk", "lutsk", "lviv", "mk", "net", "nikolaev", "odessa", "od", "org", "pl", "poltava", "rovno", "rv", "sebastopol", "sumy", "ternopil", "te", "uzhgorod", "vinnica", "vn", "zaporizhzhe", "zhitomir", "zp", "zt" ];
		lp_all_tlds.tw = [ "club", "com", "ebiz", "edu", "game", "gove", "gov", "idv", "mil", "net", "org" ];
		lp_all_tlds.ag = [ "co", "com", "net", "nom", "org" ];
		lp_all_tlds.ao = [ "co", "ed", "gv", "it", "og", "pb" ];
		lp_all_tlds.bw = [ "co", "org" ];
		lp_all_tlds.ck = [ "co" ];
		lp_all_tlds.ls = [ "co", "org" ];
		lp_all_tlds.ma = [ "co", "gov", "net", "org" ];
		lp_all_tlds.af = [ "com", "edu", "gov", "net" ];
		lp_all_tlds.ai = [ "com", "net", "off", "org" ];
		lp_all_tlds.al = [ "com", "edu", "gov", "inima", "net", "org", "soros", "tirana", "uniti", "upt" ];
		lp_all_tlds.an = [ "com", "edu", "net", "org" ];
		lp_all_tlds.ar = [ "com", "gov", "int", "mil", "net", "org" ];
		lp_all_tlds.aw = [ "com" ];
		lp_all_tlds.bb = [ "com", "edu", "gov", "net", "org" ];
		lp_all_tlds.bd = [ "com", "edu", "gov", "mil", "net", "org" ];
		lp_all_tlds.bm = [ "com", "edu", "gov", "net", "org" ];
		lp_all_tlds.bn = [ "com", "edu", "net", "org" ];
		lp_all_tlds.bo = [ "com", "edu", "gob", "gov", "int", "mil", "net", "org", "tv" ];
		lp_all_tlds.bs = [ "com", "net", "org" ];
		lp_all_tlds.bt = [ "com", "edu", "gov", "net", "org" ];
		lp_all_tlds.cd = [ "com", "net", "org" ];
		lp_all_tlds.ch = [ "com", "gov", "net", "org" ];
		lp_all_tlds.cu = [ "com", "edu", "gov", "inf", "net", "org" ];
		lp_all_tlds.dm = [ "com", "edu", "gov", "net", "org" ];
		lp_all_tlds.ec = [ "com", "edu", "fin", "gov", "info", "k12", "med", "mil", "net", "org", "pro" ];
		lp_all_tlds.ee = [ "com", "fie", "org", "pri" ];
		lp_all_tlds.eg = [ "com", "edu", "eun", "gov", "mil", "net", "org", "sci" ];
		lp_all_tlds.es = [ "com", "edu", "gob", "nom", "org" ];
		lp_all_tlds.eu = [ "com" ];
		lp_all_tlds.gb = [ "com", "net" ];
		lp_all_tlds.ge = [ "com", "edu", "gov", "mil", "net", "org", "pvt" ];
		lp_all_tlds.gh = [ "com", "edu", "gov", "mil", "org" ];
		lp_all_tlds.gi = [ "com", "edu", "gov", "ltd", "mod", "org" ];
		lp_all_tlds.gr = [ "com", "edu", "gov", "net", "org" ];
		lp_all_tlds.gu = [ "com", "edu", "gov", "mil", "net", "org" ];
		lp_all_tlds.hk = [ "com", "edu", "gov", "idv", "net", "org" ];
		lp_all_tlds.hn = [ "com", "edu", "gob", "mil", "net", "org" ];
		lp_all_tlds.hr = [ "com", "from", "iz", "name" ];
		lp_all_tlds.jm = [ "com", "edu", "gov", "net", "org" ];
		lp_all_tlds.jo = [ "com", "edu", "gov", "mil", "net", "org" ];
		lp_all_tlds.kh = [ "com", "edu", "gov", "mil", "net", "org", "per" ];
		lp_all_tlds.kw = [ "com", "edu", "gov", "mil", "net", "org" ];
		lp_all_tlds.ky = [ "com", "edu", "gov", "net", "org" ];
		lp_all_tlds.kz = [ "com", "edu", "gov", "mil", "net", "org" ];
		lp_all_tlds.la = [ "com", "net", "org" ];
		lp_all_tlds.lb = [ "com", "edu", "gov", "mil", "net", "org" ];
		lp_all_tlds.lc = [ "com", "edu", "gov", "net", "org" ];
		lp_all_tlds.li = [ "com", "gov", "net", "org" ];
		lp_all_tlds.lr = [ "com", "edu", "gov", "net", "org" ];
		lp_all_tlds.ly = [ "com", "edu", "gov", "id", "med", "net", "org", "plc", "sch" ];
		lp_all_tlds.mg = [ "com", "edu", "gov", "mil", "nom", "org", "prd", "tm" ];
		lp_all_tlds.mk = [ "com", "org" ];
		lp_all_tlds.mm = [ "com", "edu", "gov", "net", "org" ];
		lp_all_tlds.mo = [ "com", "edu", "gov", "net", "org" ];
		lp_all_tlds.mt = [ "com", "edu", "gov", "net", "org" ];
		lp_all_tlds.mu = [ "com", "co" ];
		lp_all_tlds.mx = [ "com", "edu", "gob", "gov", "net", "org" ];
		lp_all_tlds.my = [ "com", "edu", "gov", "mil", "name", "net", "org" ];
		lp_all_tlds.na = [ "com", "net", "org" ];
		lp_all_tlds.nc = [ "com", "net", "org" ];
		lp_all_tlds.ng = [ "com", "edu", "gov", "net", "org" ];
		lp_all_tlds.ni = [ "com", "edu", "gob", "net", "nom", "org" ];
		lp_all_tlds.no = [ "com", "fhs", "folkebibl", "fylkesbibl", "herad", "idrett", "kommune", "mil", "museum", "priv", "stat", "vgs" ];
		lp_all_tlds.np = [ "com", "edu", "gov", "mil", "net", "org", "ort" ];
		lp_all_tlds.pe = [ "com", "edu", "gob", "mil", "net", "nom", "org" ];
		lp_all_tlds.pf = [ "com", "edu", "org" ];
		lp_all_tlds.pg = [ "com", "net" ];
		lp_all_tlds.ph = [ "com", "gov", "mil", "net", "ngo", "org" ];
		lp_all_tlds.ps = [ "com", "edu", "gov", "net", "org", "plo", "sec" ];
		lp_all_tlds.pt = [ "com", "edu", "gov", "int", "net", "nome", "org", "publ" ];
		lp_all_tlds.py = [ "com", "edu", "gov", "net", "org" ];
		lp_all_tlds.qc = [ "com" ];
		lp_all_tlds.sa = [ "com", "edu", "gov", "med", "net", "org", "pub", "sch" ];
		lp_all_tlds.sb = [ "com", "edu", "gov", "net" ];
		lp_all_tlds.sc = [ "com", "edu", "gov", "net", "org" ];
		lp_all_tlds.sd = [ "com", "edu", "gov", "info", "med", "net", "org", "tv" ];
		lp_all_tlds.sg = [ "com", "edu", "gov", "idn", "net", "org", "per" ];
		lp_all_tlds.sh = [ "com", "edu", "gov", "mil", "net", "org" ];
		lp_all_tlds.sv = [ "com", "co", "edu", "gob", "org", "red" ];
		lp_all_tlds.sy = [ "com", "gov", "net", "org" ];
		lp_all_tlds.tn = [ "com", "edunet", "ens", "fin", "gov", "ind", "info", "intl", "nat", "net", "org", "rnrt", "rns", "rnu", "tourism" ];
		lp_all_tlds.uy = [ "com", "edu", "gub", "mil", "net", "org" ];
		lp_all_tlds.vi = [ "com", "co", "edu", "gov", "net", "org" ];
		lp_all_tlds.ye = [ "com", "net" ];
		lp_all_tlds.pro = [ "cpa", "law", "med" ];
		lp_all_tlds.arpa = [ "e164", "in-addr", "ip6", "iris", "uri", "urn" ];
		lp_all_tlds["int"] = [ "eu" ];
		lp_all_tlds.bf = [ "gov" ];
		lp_all_tlds.by = [ "gov", "mil" ];
		lp_all_tlds.cx = [ "gov" ];
		lp_all_tlds.ie = [ "gov" ];
		lp_all_tlds.it = [ "gov", "pisa" ];
		lp_all_tlds.lt = [ "gov", "mil" ];
		lp_all_tlds.lu = [ "gov", "mil", "net", "org" ];
		lp_all_tlds.to = [ "gov" ];
		lp_all_tlds.tp = [ "gov" ];
		lp_all_tlds.tv = [ "gov" ];
		lp_all_tlds.mobi = [ "music", "weather" ];
		lp_all_tlds.mh = [ "net" ];
		lp_all_tlds.ad = [ "nom" ];
		lp_all_tlds.sr = [ "rs" ];
		lp_all_tlds.va = [ "vatican" ]
	}
}
function checkurlrules(a, b, c, e, d, g, k) {
	if (b.length == 0)
		return b;
	for ( var n = [], o = [], f = 0; f < a.length; f++) {
		if (typeof a[f].tld == "undefined") {
			a[f].tld = lp_gettld_url(a[f].url);
			a[f].parts = lpParseUri(a[f].url);
			a[f].path = typeof a[f].parts.path == "string" ? a[f].parts.path : ""
		}
		if (c == a[f].tld)
			if (a[f].path != "" && e.indexOf(a[f].path) != 0)
				o[o.length] = a[f];
			else if (d == a[f].parts.host || a[f].exacthost == 1 && d.indexOf("." + a[f].parts.host) != -1 || a[f].exacthost == 0)
				n[n.length] = a[f];
			else
				o[o.length] = a[f]
	}
	if (n.length == 0 && o.length == 0)
		return b;
	if (n.length > 0) {
		a = b;
		for (f = 0; f < n.length; f++) {
			c = applyurlrule(b, n[f], e, d, k);
			if (c.length < a.length)
				a = c
		}
		return a
	} else {
		for (f = 0; f < o.length; f++)
			removeurlrule(b, o[f], g, d, k);
		return b
	}
}
function applyurlrule(a, b, c, e, d) {
	var g = b.path;
	if (g != "" && c.indexOf(g) != 0)
		return a;
	for ( var k = g.split("/").length, n = [], o = false, f = 0; f < a.length; f++) {
		var r = a[f], q = r.pathlevelmatch, x = r.servermatch, j = r.portmatch;
		if (typeof q == "undefined") {
			q = c.split("/");
			r = lpParseUri(r.url);
			r.path = typeof r.path != "undefined" ? r.path : "";
			x = r.path.split("/");
			for (j = 0; j < q.length && j < x.length; j++)
				if (x[j] != q[j])
					break;
			q = j;
			x = e == r.host;
			j = d == get_port(r)
		}
		if (!(g != "" && q < k)) {
			o = o || b.exacthost == 1 || b.exactport == 1 ? true : false;
			if ((x || b.exacthost == 0) && (j || b.exactport == 0)) {
				o = true;
				n[n.length] = a[f]
			}
		}
	}
	if (!o)
		return a;
	return n
}
function removeurlrule(a, b, c, e, d) {
	for ( var g = b.path, k = 0; k < a.length; k++) {
		var n = typeof a[k].id != "undefined" ? a[k].id : a[k].aid;
		if (typeof c[n] != "undefined") {
			n = lpParseUri(c[n].url);
			n.path = typeof n.path != "undefined" ? n.path : "";
			if (g != "")
				if (n.path.indexOf(g) != 0)
					continue;
			if ((b.exacthost == "0" || e == n.host) && (b.exactport == "0" || d == get_port(n))) {
				a.splice(k, 1);
				k -= 1
			}
		}
	}
}
function lpsubstring(a, b, c) {
	var e = "", d = c - b;
	for (c = 0; c < d; ++c)
		e += a[c + b];
	return e
}
function lpcreaterandomhexstring(a) {
	for ( var b = "", c = 0; c < a; c++) {
		var e = get_random(0, 15);
		b += "0123456789ABCDEF".substring(e, e + 1)
	}
	return b
}
function reencryptShareeAutoPushes(a, b, c) {
	var e = [ "name", "group", "username", "password", "extra" ], d = {}, g = true;
	for (m in e) {
		var k = e[m];
		if (b[k] != null) {
			d[k] = lpdec(b[k], a);
			if (b[k] != "" && (d[k] == null || d[k] == "")) {
				lpReportError("lprsa_acceptshareeautopushes : failing id=" + b.id + " because we failed to decrypt : " + k + "=" + b[k]);
				g = false;
				break
			}
			var n = lpenc(d[k]);
			if (d[k] != "" && (n == null || n == "")) {
				lpReportError("lprsa_acceptshareeautopushes : failing aid=" + c + " id=" + b.id + " because we failed to reencrypt : " + k);
				g = false;
				break
			}
			d[k] = n
		}
	}
	if (!g)
		return null;
	for ( var o in b.fields) {
		e = b.fields[o];
		if ("email" == e.type || e.type == "text" || e.type == "password" || e.type == "textarea" || e.type == "hidden") {
			k = e.value;
			e = lpdec(k, a);
			if (k != "" && (e == null || e == "")) {
				lpReportError("lprsa_acceptshareeautopushes : failing aid=" + c + " id=" + b.id + " because we failed to decrypt field" + o + "=" + k);
				g = false;
				break
			}
			k = lpenc(e);
			if (e != "" && (k == null || k == "")) {
				lpReportError("lprsa_acceptshareeautopushes : failing aid=" + c + " id=" + b.id + " because we failed to reencrypt field" + o + "=" + e);
				g = false;
				break
			}
			b.fields[o].value = k
		}
	}
	if (!g)
		return null;
	for (o in b.otherfields) {
		e = b.otherfields[o];
		if ("email" == e.type || e.type == "text" || e.type == "password" || e.type == "textarea" || e.type == "hidden") {
			k = e.value;
			e = lpdec(k, a);
			if (k != "" && (e == null || e == "")) {
				lpReportError("lprsa_acceptshareeautopushes : failing aid=" + c + " id=" + b.id + " because we failed to decrypt otherfield" + o + "=" + k);
				g = false;
				break
			}
			k = lpenc(e);
			if (e != "" && (k == null || k == "")) {
				lpReportError("lprsa_acceptshareeautopushes : failing aid=" + c + " id=" + b.id + " because we failed to reencrypt otherfield" + o + "=" + e);
				g = false;
				break
			}
			b.otherfields[o].value = k
		}
	}
	if (!g)
		return null;
	a = {};
	for (i in b)
		if (i == "fields") {
			a.numf = b.fields.length;
			for (o in b.fields) {
				a["f" + o + "urid"] = b.fields[o].urid;
				a["f" + o + "name"] = b.fields[o].name;
				a["f" + o + "value"] = b.fields[o].value;
				a["f" + o + "type"] = b.fields[o].type
			}
		} else if (i == "otherfields") {
			a.numof = b.otherfields.length;
			for (o in b.otherfields) {
				a["of" + o + "urid"] = b.otherfields[o].urid;
				a["of" + o + "name"] = b.otherfields[o].name;
				a["of" + o + "value"] = b.otherfields[o].value;
				a["of" + o + "type"] = b.otherfields[o].type;
				a["of" + o + "formname"] = b.otherfields[o].formname
			}
		} else if (i != "sharekeyhexenc" && b[i] != null)
			a[i] = typeof d[i] != "undefined" ? d[i] : b[i];
	return a
}
function createShareeAutoPushesResponse(a, b, c) {
	a = a.responseXML.documentElement;
	var e = a.getElementsByTagName("sharerpublickeys"), d = a.getElementsByTagName("shareepublickeys"), g = a.getElementsByTagName("encfields"), k = a.getElementsByTagName("encofields");
	if (e.length <= 0 && d.length <= 0)
		return false;
	a = b.aid;
	var n = b.postdata;
	b = typeof b.newvalues == "undefined" ? [] : b.newvalues;
	if (typeof c == "undefined" || c == null) {
		lpReportError("SHARE : createShareeAutoPushesResponse failed for aid=" + a, null);
		return false
	}
	var o = {}, f = g[0].getElementsByTagName("encfield");
	n += "&numencf=" + LP.en(f.length);
	for (g = 0; g < f.length; ++g) {
		var r = f[g].getAttribute("afid"), q = f[g].getAttribute("value");
		o[r] = q
	}
	f = {};
	k = k[0].getElementsByTagName("encofield");
	n += "&numencof=" + LP.en(k.length);
	for (g = 0; g < k.length; ++g) {
		r = k[g].getAttribute("afid");
		q = k[g].getAttribute("value");
		f[r] = q
	}
	n += "&numvalueenc=" + LP.en(b.length);
	for (u = 0; u < b.length; ++u) {
		g = lpenc(b[u]);
		n += "&valueenc" + u + "=" + LP.en(g)
	}
	if (d.length > 0) {
		k = d[0].getElementsByTagName("sharee");
		n += "&numsharees=" + LP.en(k.length);
		for (g = 0; g < k.length; ++g) {
			var x = k[g].getAttribute("uid");
			u = k[g].getAttribute("key");
			q = lpcreaterandomhexstring(64);
			d = lp_hex2bin(q);
			q = lprsa_encryptdata(u, q);
			if (q == false) {
				lpReportError("SHARE : lprsa_encryptdata failed for shareeuid=" + x + " using shareepublickeyhex=" + u, null);
				return false
			}
			n += "&sharee" + g + "uid=" + LP.en(x);
			n += "&sharee" + g + "sharekeyhexenc=" + LP.en(q);
			q = {
			name : c.name,
			grouping : c.group,
			username : typeof g_sites != "undefined" ? lpmdec(c.username, true) : lpdec(c.username),
			password : typeof g_sites != "undefined" ? lpmdec(c.password, true) : lpdec(c.password),
			extra : typeof g_sites != "undefined" ? lpmdec(c.extra, true) : lpdec(c.extra)
			};
			for ( var j in q) {
				var p = lpenc(q[j], d);
				if (q[j] != "" && (p == null || p == "")) {
					lpReportError("SHARE : error AES encrypting aid=" + a + " for shareeuid=" + x, null);
					return false
				}
				n += "&sharee" + g + j + "=" + LP.en(p)
			}
			var u = 0;
			for (r in o) {
				q = lpdec(o[r]);
				p = lpenc(q, d);
				if (q != "" && (p == null || p == "")) {
					lpReportError("SHARE : error AES encrypting field afid=" + r + " aid=" + a + " for shareeuid=" + x, null);
					return false
				}
				n += "&sharee" + g + "fafid" + u + "=" + LP.en(r);
				n += "&sharee" + g + "fvalue" + u + "=" + LP.en(p);
				++u
			}
			u = 0;
			for (r in f) {
				q = lpdec(f[r]);
				p = lpenc(q, d);
				if (q != "" && (p == null || p == "")) {
					lpReportError("SHARE : error AES encrypting otherfield afid=" + r + " aid=" + a + " for shareeuid=" + x, null);
					return false
				}
				n += "&sharee" + g + "ofafid" + u + "=" + LP.en(r);
				n += "&sharee" + g + "ofvalue" + u + "=" + LP.en(p);
				++u
			}
			for (u = 0; u < b.length; ++u) {
				q = b[u];
				p = lpenc(q, d);
				if (q != "" && (p == null || p == "")) {
					lpReportError("SHARE : error AES encrypting newvalues k=" + u + " aid=" + a + " for shareeuid=" + x, null);
					return false
				}
				n += "&sharee" + g + "valueenc" + u + "=" + LP.en(p)
			}
		}
	}
	if (e.length > 0) {
		e = e[0].getElementsByTagName("sharer");
		n += "&numsharers=" + LP.en(e.length);
		for (g = 0; g < e.length; ++g) {
			k = e[g].getAttribute("uid");
			x = e[g].getAttribute("key");
			q = lpcreaterandomhexstring(64);
			d = lp_hex2bin(q);
			q = lprsa_encryptdata(x, q);
			if (q == false) {
				lpReportError("SHARE : lprsa_encryptdata failed for shareruid=" + k + " using sharerpublickeyhex=" + x, null);
				return false
			}
			n += "&sharer" + g + "uid=" + LP.en(k);
			n += "&sharer" + g + "sharekeyhexenc=" + LP.en(q);
			q = {
			name : c.name,
			grouping : c.group,
			username : typeof g_sites != "undefined" ? lpmdec(c.username, true) : lpdec(c.username),
			password : typeof g_sites != "undefined" ? lpmdec(c.password, true) : lpdec(c.password),
			extra : typeof g_sites != "undefined" ? lpmdec(c.extra, true) : lpdec(c.extra)
			};
			for (j in q) {
				p = lpenc(q[j], d);
				if (q[j] != "" && (p == null || p == "")) {
					lpReportError("SHARE : error AES encrypting aid=" + a + " for shareruid=" + k, null);
					return false
				}
				n += "&sharer" + g + j + "=" + LP.en(p)
			}
			u = 0;
			for (r in o) {
				q = lpdec(o[r]);
				p = lpenc(q, d);
				if (q != "" && (p == null || p == "")) {
					lpReportError("SHARE : error AES encrypting field afid=" + r + " aid=" + a + " for shareruid=" + k, null);
					return false
				}
				n += "&sharer" + g + "fafid" + u + "=" + LP.en(r);
				n += "&sharer" + g + "fvalue" + u + "=" + LP.en(p);
				++u
			}
			u = 0;
			for (r in f) {
				q = lpdec(f[r]);
				p = lpenc(q, d);
				if (q != "" && (p == null || p == "")) {
					lpReportError("SHARE : error AES encrypting otherfield afid=" + r + " aid=" + a + " for shareruid=" + k, null);
					return false
				}
				n += "&sharer" + g + "ofafid" + u + "=" + LP.en(r);
				n += "&sharer" + g + "ofvalue" + u + "=" + LP.en(p);
				++u
			}
			for (u = 0; u < b.length; ++u) {
				q = b[u];
				p = lpenc(q, d);
				if (q != "" && (p == null || p == "")) {
					lpReportError("SHARE : error AES encrypting newvalues k=" + u + " aid=" + a + " for shareruid=" + k, null);
					return false
				}
				n += "&sharer" + g + "valueenc" + u + "=" + LP.en(p)
			}
		}
	}
	return n
}
function parseAutoPushMobile(a, b) {
	for ( var c = 0; a != null && c < a.length; c++) {
		var e = new lpshareeautopushinfo;
		e.fields = [];
		e.otherfields = [];
		var d = true, g = [ "id", "aid", "sharekeyhexenc", "name", "group", "username", "password", "extra", "url", "rurl", "fav", "never_autofill", "pwprotect", "basic_auth", "autologin", "last_touch", "last_modified", "urid", "last_pw_change", "numf", "numof", "favico", "nexturid", "method", "is_http", "manual" ], k;
		for (k in g)
			if (typeof a[c][g[k]] != "undefined")
				e[g[k]] = a[c][g[k]];
			else if (g[k] == "id" || g[k] == "aid" || g[k] == "sharekeyhexenc") {
				lpReportError("SHARE: shareeautopushes : error missing required arg=" + g[k], null);
				d = false;
				break
			} else
				e[g[k]] = null;
		if (d) {
			d = e.numf != null ? e.numf : 0;
			for (k = 0; k < d; ++k) {
				g = {};
				g.urid = a[c]["f" + k + "urid"];
				g.name = a[c]["f" + k + "name"];
				g.value = a[c]["f" + k + "value"];
				g.type = a[c]["f" + k + "type"];
				e.fields.push(g)
			}
			d = e.numof != null ? e.numof : 0;
			for (k = 0; k < d; ++k) {
				g = {};
				g.urid = a[c]["of" + k + "urid"];
				g.name = a[c]["of" + k + "name"];
				g.value = a[c]["of" + k + "value"];
				g.type = a[c]["of" + k + "type"];
				g.formname = a[c]["of" + k + "formname"];
				e.otherfields.push(g)
			}
			if (typeof b[e.aid] == "undefined")
				b[e.aid] = [];
			b[e.aid].push(e)
		}
	}
}
function iso2to3(a) {
	return {
	AD : "AND",
	AE : "ARE",
	AF : "AFG",
	AF : "AFG",
	AG : "ATG",
	AL : "ALB",
	AM : "ARM",
	AO : "AGO",
	AQ : "ATA",
	AR : "ARG",
	AT : "AUT",
	AU : "AUS",
	AW : "ABW",
	AZ : "AZE",
	BA : "BIH",
	BB : "BRB",
	BD : "BGD",
	BE : "BEL",
	BF : "BFA",
	BG : "BGR",
	BH : "BHR",
	BI : "BDI",
	BJ : "BEN",
	BM : "BMU",
	BN : "BRN",
	BO : "BOL",
	BR : "BRA",
	BS : "BHS",
	BT : "BTN",
	BW : "BWA",
	BY : "BLR",
	BZ : "BLZ",
	CA : "CAN",
	CD : "COD",
	CF : "CAF",
	CG : "COG",
	CH : "CHE",
	CI : "CIV",
	CL : "CHL",
	CM : "CMR",
	CN : "CHN",
	CO : "COL",
	CR : "CRI",
	CU : "CUB",
	CV : "CPV",
	CY : "CYP",
	CZ : "CZE",
	DE : "DEU",
	DJ : "DJI",
	DK : "DNK",
	DM : "DMA",
	DO : "DOM",
	DZ : "DZA",
	EC : "ECU",
	EE : "EST",
	EG : "EGY",
	EH : "ESH",
	ER : "ERI",
	ES : "ESP",
	ET : "ETH",
	FI : "FIN",
	FJ : "FJI",
	FM : "FSM",
	FO : "FRO",
	FR : "FRA",
	GA : "GAB",
	GB : "GBR",
	GD : "GRD",
	GE : "GEO",
	GF : "GUF",
	GH : "GHA",
	GM : "GMB",
	GN : "GIN",
	GP : "GLP",
	GQ : "GNQ",
	GR : "GRC",
	GT : "GTM",
	GW : "GNB",
	GY : "GUY",
	HN : "HND",
	HR : "HRV",
	HT : "HTI",
	HU : "HUN",
	IC : "ESC",
	ID : "IDN",
	IE : "IRL",
	IL : "ISR",
	IN : "IND",
	IO : "IOT",
	IQ : "IRQ",
	IR : "IRN",
	IS : "ISL",
	IT : "ITA",
	JE : "JEY",
	JM : "JAM",
	JO : "JOR",
	JP : "JPN",
	KE : "KEN",
	KG : "KGZ",
	KH : "KHM",
	KI : "KIR",
	KM : "COM",
	KN : "KNA",
	KP : "PRK",
	KR : "KOR",
	KW : "KWT",
	KZ : "KAZ",
	LA : "LAO",
	LB : "LBN",
	LC : "LCA",
	LI : "LIE",
	LK : "LKA",
	LR : "LBR",
	LS : "LSO",
	LT : "LTU",
	LU : "LUX",
	LV : "LVA",
	LY : "LBY",
	MA : "MAR",
	MC : "MCO",
	MD : "MDA",
	ME : "MNE",
	MG : "MDG",
	MK : "MKD",
	ML : "MLI",
	MM : "MMR",
	MN : "MNG",
	MO : "MAC",
	MQ : "MTQ",
	MR : "MRT",
	MS : "MSR",
	MU : "MUS",
	MV : "MDV",
	MW : "MWI",
	MX : "MEX",
	MY : "MYS",
	MZ : "MOZ",
	NA : "NAM",
	NE : "NER",
	NG : "NGA",
	NI : "NIC",
	NL : "NLD",
	NO : "NOR",
	NP : "NPL",
	NZ : "NZL",
	OM : "OMN",
	PA : "PAN",
	PE : "PER",
	PG : "PNG",
	PH : "PHL",
	PK : "PAK",
	PL : "POL",
	PS : "PSE",
	PT : "PRT",
	PW : "PLW",
	PY : "PRY",
	QA : "QAT",
	RE : "REU",
	RO : "ROU",
	RS : "SRB",
	RU : "RUS",
	RW : "RWA",
	SA : "SAU",
	SB : "SLB",
	SC : "SYC",
	SD : "SDN",
	SE : "SWE",
	SH : "SHN",
	SI : "SVN",
	SK : "SVK",
	SL : "SLE",
	SM : "SMR",
	SN : "SEN",
	SO : "SOM",
	SR : "SUR",
	ST : "STP",
	SV : "SLV",
	SY : "SYR",
	SZ : "SWZ",
	TD : "TCD",
	TF : "ATF",
	TG : "TGO",
	TH : "THA",
	TJ : "TJK",
	TL : "TLS",
	TM : "TKM",
	TN : "TUN",
	TR : "TUR",
	TT : "TTO",
	TW : "TWN",
	TZ : "TZA",
	UA : "UKR",
	UG : "UGA",
	US : "USA",
	UY : "URY",
	UZ : "UZB",
	VC : "VCT",
	VE : "VEN",
	VN : "VNM",
	VU : "VUT",
	YE : "YEM",
	ZA : "ZAF",
	ZM : "ZMB",
	ZW : "ZWE"
	}[a]
}
function crypto_atob(a) {
	if (a && a.length >= 17 && a.charAt(0) == "!") {
		var b = a.indexOf("|");
		if (b != -1)
			return "!" + atob(a.substring(1, b)) + atob(a.substring(b + 1))
	}
	return atob(a)
}
function crypto_btoa(a) {
	return a && a.length >= 33 && a.length % 16 == 1 && a.charAt(0) == "!" ? "!" + btoa(a.substring(1, 17)) + "|" + btoa(a.substring(17)) : btoa(a)
}
function CompareLastPassVersions(a, b, c) {
	var e = 0, d = 0, g = 0, k = 0, n = 0, o = 0, f = a.split(".");
	for (a = 0; a < f.length; a++)
		if (a == 0)
			e = parseInt(f[a]);
		else if (a == 1)
			d = parseInt(f[a]);
		else if (a == 2)
			g = parseInt(f[a]);
	b = b.split(".");
	for (a = 0; a < b.length; a++)
		if (a == 0)
			k = parseInt(b[a]);
		else if (a == 1)
			n = parseInt(b[a]);
		else if (a == 2)
			o = parseInt(b[a]);
	if (e != k)
		return e > k ? 1 : -1;
	if (d != n)
		return d > n ? 1 : -1;
	if (c)
		return 0;
	if (g != o)
		return g > o ? 1 : -1;
	return 0
}
function lpalert(a, b) {
	if (typeof LP != "undefined" && typeof LP.lpgs == "function")
		LP.alert(LP.lpgs(a), b);
	else
		typeof alertfrombg == "function" ? alertfrombg(gs(a)) : alert(gs(a))
}
function issharedfolder(a, b) {
	if (!a || a.length == 0 || typeof b == "undefined" || b == null)
		return false;
	var c = b;
	if (c.indexOf("\\") > 0)
		c = c.substr(0, c.indexOf("\\"));
	for ( var e in a) {
		var d = a[e];
		if (!(typeof d != "object" || typeof d.decsharename == "undefined"))
			if (d.decsharename == c)
				return {
				id : d.id,
				sharekey : d.key,
				decsharename : d.decsharename,
				readonly : d.readonly,
				give : d.give
				}
	}
	return false
}
function getsharekey(a, b) {
	for ( var c = 0; typeof a != "undefined" && a != null && c < a.length; c++) {
		var e = a[c];
		if (e.id == b)
			return e.key
	}
	return null
}
function lpmenc_acct(a, b, c, e) {
	if (typeof c.sharefolderid == "undefined")
		return lpmenc(a, b);
	if (c = issharedfolder(e, c.group))
		return lpmenc(a, b, c.sharekey);
	return lpmenc(a, b)
}
function lpmdec_acct(a, b, c, e) {
	if (typeof c.sharefolderid == "undefined")
		return lpmdec(a, b);
	if (c = issharedfolder(e, c.group))
		return lpmdec(a, b, c.sharekey);
	return lpmdec(a, b)
}
function lpdec_acct(a, b, c) {
	if (typeof b.sharefolderid == "undefined")
		return lpdec(a);
	if (b = issharedfolder(c, b.group))
		return lpdec(a, b.sharekey);
	return lpdec(a)
}
function lpenc_acct(a, b, c) {
	if (typeof b.sharefolderid == "undefined")
		return lpenc(a);
	if (b = issharedfolder(c, b.group))
		return lpenc(a, b.sharekey);
	return lpenc(a)
}
function checkmove() {
	return true
}
function checkreadonly(a, b, c) {
	if (a && a.readonly == "1") {
		b || lpalert("Sorry, this shared folder is read-only.", c);
		return false
	}
	return true
}
function checkUsernameHash() {
	if (lpusername_hash == null || lpusername_hash == "") {
		var a = null;
		if (typeof g_username == "string" && g_username != "")
			a = g_username;
		else if (typeof lpusername == "string" && lpusername != "")
			a = lpusername;
		if (a != null)
			if (typeof SHA256 == "function")
				lpusername_hash = SHA256(a);
			else if (typeof lp_sha256 == "function")
				lpusername_hash = lp_sha256(a)
	}
}
function checkAttach() {
	if (!(typeof LP == "object" && typeof LP.isFennec != "undefined" && LP.isFennec))
		if (lp_server_attach_version > 0) {
			checkUsernameHash();
			var a = ReadFileGeneric(lpusername_hash + "_version.att", false, 25);
			a || (a = 0);
			if (a < lp_server_attach_version) {
				a = "version=" + LP.en(a) + "&b64=1";
				LP.lpMakeRequest(LP.lp_base + "getattach.php", a, lpSaveAttach)
			}
		}
}
function lpSaveAttach(a) {
	if (4 == a.readyState && 200 == a.status) {
		a = atob(a.responseText);
		lp_local_attach_version = lp_server_attach_version = get_version(a, "LPAT");
		WriteFileGeneric(lpusername_hash + "_version.att", lp_server_attach_version);
		parseAttachData(a, true)
	}
}
function lpReadAttach(a) {
	checkUsernameHash();
	a = ReadFileGeneric(lpusername_hash + "_" + a + ".att");
	if (!a)
		return null;
	return b64_to_utf8(a)
}
function parseAttachData(a) {
	if (a && a.length && a.indexOf("LPAT") == 0)
		for ( var b = a.length, c = unserialize_num(a.substring(4, 8)) + 8; c < b;) {
			var e = unserialize_num(a.substring(c, c + 4)), d = c + 4, g = unserialize_num(a.substring(d, d + 4)), k = a.substring(d + 4, d + 4 + g);
			d += 4 + g;
			g = unserialize_num(a.substring(d, d + 4));
			d = a.substring(d + 4, d + 4 + g);
			d == "delete" ? DeleteFileGeneric(lpusername_hash + "_" + k + ".att") : WriteFileGeneric(lpusername_hash + "_" + k + ".att", utf8_to_b64(d));
			c += 4 + e
		}
}
function applyattacharraychanges(a) {
	if (typeof a.add != "undefined")
		for ( var b in a.add)
			if (a.add.hasOwnProperty(b)) {
				var c = [];
				c.id = a.add[b].id;
				c.parent = a.add[b].parent;
				c.mimetype = a.add[b].mimetype;
				lp_attaches.push(c)
			}
	if (typeof a.remove != "undefined")
		for (b in a.remove)
			for (c = 0; c < lp_attaches.length; c++)
				b == lp_attaches[c].id && lp_attaches.splice(c, 1)
}
function rollbackattacharrayadds(a) {
	if (typeof a.add != "undefined")
		for ( var b in a.add)
			if (a.add.hasOwnProperty(b))
				for ( var c = 0; c < lp_attaches.length; c++)
					if (lp_attaches[c].id == a.add[b].id) {
						lp_attaches.splice(c, 1);
						break
					}
}
function utf8_to_b64(a) {
	return btoa(a)
}
function b64_to_utf8(a) {
	return atob(a)
}
function is_encrypted_field(a) {
	return a == "text" || a == "password" || a == "textarea" || a == "email"
}
var lpffregexpnames = [ "combineddummy", "phoneext", "gender", "ssn1", "ssn2", "ssn3", "ssn", "birthyear", "birthmonth", "birthday", "birthdate", "city", "county", "state", "zip1", "zip2", "zip", "country", "email", "mobileemail", "housenumbername", "housenumber", "housename", "address1", "ccphone", "address2", "address3", "mobilephone1", "mobilephone2", "mobilephone3", "mobilephone", "evephone1", "evephone2", "evephone3", "evephone", "phone1", "phone2", "phone3", "phone", "fax1", "fax2", "fax3", "fax", "title", "ccname", "ccnum1", "ccnum2", "ccnum3", "ccnum4", "cccsc", "ccnum", "ccstartmonth", "ccstartyear", "ccstart", "ccexpmonth", "ccexpyear", "ccexp", "cctype", "ccissuenum", "firstname3", "firstname2", "firstname", "middlename", "middleinitial", "lastname3", "lastname2", "lastname", "fulllastname", "address", "company", "username", "bankname", "addrbookname", "name", "age", "timezone", "bankacctnum", "bankroutingnum" ], lpffdummyregexpnames = [ "securityanswer", "promocode", "maiden", "comments", "invoice", "addrbookname", "emailalert", "combineddummy" ], lpffregexpparents = [];
lpffregexpparents.ssn1 = lpffregexpparents.ssn2 = lpffregexpparents.ssn3 = "ssn";
lpffregexpparents.birthyear = lpffregexpparents.birthmonth = lpffregexpparents.birthday = "birthdate";
lpffregexpparents.address1 = lpffregexpparents.address2 = lpffregexpparents.address3 = "address";
lpffregexpparents.phone1 = lpffregexpparents.phone2 = lpffregexpparents.phone3 = lpffregexpparents.phone23 = "phone";
lpffregexpparents.evephone1 = lpffregexpparents.evephone2 = lpffregexpparents.evephone3 = lpffregexpparents.evephone23 = "evephone";
lpffregexpparents.mobilephone1 = lpffregexpparents.mobilephone2 = lpffregexpparents.mobilephone3 = lpffregexpparents.mobilephone23 = "mobilephone";
lpffregexpparents.fax1 = lpffregexpparents.fax2 = lpffregexpparents.fax3 = lpffregexpparents.fax23 = "fax";
lpffregexpparents.ccnum1 = lpffregexpparents.ccnum2 = lpffregexpparents.ccnum3 = lpffregexpparents.ccnum4 = "ccnum";
lpffregexpparents.ccexpmonth = lpffregexpparents.ccexpyear = "ccexp";
lpffregexpparents.ccstartmonth = lpffregexpparents.ccstartyear = "ccstart";
lpffregexpparents.firstname = lpffregexpparents.middlename = lpffregexpparents.middleinitial = lpffregexpparents.lastname = lpffregexpparents.lastname2 = "name";
lpffregexpparents.zip1 = lpffregexpparents.zip2 = "zip";
lpffregexpparents.lastname = lpffregexpparents.lastname2 = "fulllastname";
var lpffregexps = [], lpfftextregexps = [], lastname2_index = -1, lastname3_index = -1;
function lptofillinfo() {
}
function lpCheckFormFill(a, b, c, e, d, g, k, n, o) {
	var f = typeof o == "string" ? true : false;
	o = typeof o == "string" ? o : "";
	if (typeof g == "undefined" || g == null)
		g = 1;
	if (g > 10)
		return false;
	if (!a && !k)
		return false;
	var r = null;
	if (typeof LP == "object" && !LP.isFennec && LP.getBrowser().selectedTab == null)
		return false;
	var q = null;
	if (typeof LP == "object")
		q = LP.isFennec ? a : LP.getBrowser().selectedTab.linkedBrowser;
	var x = q && q.contentDocument ? q.contentDocument : null;
	try {
		if (typeof k == "undefined" || k == null)
			k = a.contentWindow;
		r = a ? LP.lpgetcurrenturl(a) : k.location.href;
		if (typeof punycode != "undefined" && typeof punycode.URLToASCII != "undefined")
			r = punycode.URLToASCII(r);
		if (typeof lpformfills != "undefined" && lpformfills.length == 0 && !f) {
			if (q) {
				var j = q.contentDocument;
				if (j)
					j.m_abortedFormFillChecking = true
			}
			return false
		}
		var p = b.getElementsByTagName("form");
		if (x && !c)
			if (typeof x.m_checkfillformresult != "undefined" && x.m_checkfillformnumforms == p.length)
				return x.m_checkfillformresult;
		if (!c && (typeof lpShowFormFillNotifications != "undefined" && !lpShowFormFillNotifications || p.length == 0)) {
			if (q)
				if (j = q.contentDocument)
					j.m_abortedFormFillChecking = true;
			if (x) {
				x.m_checkfillformresult = false;
				x.m_checkfillformnumforms = p.length
			}
			return false
		}
		if (!c && !e && typeof lp_notification_exists != "undefined" && (lp_notification_exists(a, "autologin") || lp_notification_exists(a, "generate") || lp_notification_exists(a, "formfill"))) {
			if (q)
				if (j = q.contentDocument)
					j.m_abortedFormFillChecking = true;
			if (x) {
				x.m_checkfillformresult = false;
				x.m_checkfillformnumforms = p.length
			}
			return false
		}
		j = null;
		if (d)
			for ( var u = 0; u < lpformfills.length; u++) {
				if (lpformfills[u].ffid == d) {
					j = lpformfills[u];
					break
				}
			}
		else if (typeof lpformfills != "undefined" && !f)
			j = lpformfills[0];
		var w, z;
		w = k.location.href.indexOf("https://") == 0 ? z = true : z = false;
		if (!c) {
			var J = lpParseUri(r), H = lpcanonizeUrl(r, J), D = lp_gettld(J.host, r);
			if (typeof never_ff != "undefined" && never_ff(H, D)) {
				if (x) {
					x.m_checkfillformresult = false;
					x.m_checkfillformnumforms = p.length
				}
				return false
			}
		}
		lpFormFillInitRegexps("en-US");
		J = null;
		var U = lpffregexps["en-US"], W = lpfftextregexps["en-US"];
		H = lpffregexpnames;
		if (d)
			for (u = 0; u < lpformfills.length; u++) {
				if (lpformfills[u].ffid == d) {
					j = lpformfills[u];
					var K = lpdec(j.profilelanguage);
					if (K.length == 5)
						J = K;
					J != "en-US" && lpFormFillInitRegexps(J);
					U = lpffregexps[J];
					W = lpfftextregexps[J];
					if (typeof j.customfields != "undefined" && j.customfields.length > 0) {
						U = [];
						W = [];
						H = [];
						for ( var y = 0; y < lpffregexps[J].length; y++) {
							U[y] = lpffregexps[J][y];
							W[y] = lpfftextregexps[J][y];
							H[y] = lpffregexpnames[y]
						}
						for (y = 0; y < j.customfields.length; y++) {
							var I = lpdec(j.customfields[y].text), A = lpdec(j.customfields[y].alttext).split(/\r\n|\r|\n/g);
							A.unshift(I);
							D = K = "";
							for ( var T = 0; T < A.length; T++) {
								I = lptrim(A[T]);
								if (I != "") {
									K += D + lp_regexp_quote(I);
									D = "|"
								}
							}
							if (K != "") {
								U.unshift(RegExp(K, "i"));
								W.unshift(RegExp(K, "i"));
								H.unshift("customfield" + y)
							}
						}
					}
					break
				}
			}
		else if (f) {
			j = new lpformfillinfo;
			j.ffid = "0";
			j.profiletype = "";
			j.profilename = "translation";
			j.profilelanguage = lpenc(o);
			j.firstname = lpenc("firstname");
			j.firstname2 = lpenc("firstname2");
			j.firstname3 = lpenc("firstname3");
			j.middlename = lpenc("middlename");
			j.lastname = lpenc("lastname");
			j.lastname2 = lpenc("lastname2");
			j.lastname3 = lpenc("lastname3");
			j.email = lpenc("email");
			j.mobileemail = lpenc("mobileemail");
			j.company = lpenc("company");
			j.ssn = lpenc("ssn");
			j.birthday = lpenc("birthday");
			j.address1 = lpenc("address1");
			j.address2 = lpenc("address2");
			j.address3 = lpenc("address3");
			j.city = lpenc("city");
			j.county = lpenc("county");
			j.state = lpenc("state");
			j.state_name = lpenc("state_name");
			j.zip = lpenc("zip");
			j.country = lpenc("country");
			j.country_cc3l = lpenc("country_cc3l");
			j.country_name = lpenc("country_name");
			j.countryphone = "countryphone";
			j.countryevephone = "countryevephone";
			j.countryfaxphone = "countryfaxphone";
			j.countrymobphone = "countrymobphone";
			j.phoneext = lpenc("phoneext");
			j.evephoneext = lpenc("evephoneext");
			j.faxphoneext = lpenc("faxphoneext");
			j.mobilephoneext = lpenc("mobilephoneext");
			j.phone = lpenc("phone");
			j.evephone = lpenc("evephone");
			j.fax = lpenc("fax");
			j.mobilephone = lpenc("mobilephone");
			j.ccname = lpenc("ccname");
			j.ccnum = lpenc("ccnum");
			j.ccstart = lpenc("ccstart");
			j.ccexp = lpenc("ccexp");
			j.cccsc = lpenc("cccsc");
			j.ccissuenum = lpenc("ccissuenum");
			j.username = lpenc("username");
			j.gender = lpenc("gender");
			j.title = lpenc("title");
			j.pwprotect = "0";
			j.creditmon = "0";
			j.customfields = [];
			j.timezone = lpenc("timezone");
			j.bankname = lpenc("bankname");
			j.bankacctnum = lpenc("bankacctnum");
			j.bankroutingnum = lpenc("bankroutingnum");
			j.notes = lpenc("notes");
			if (typeof LP_to_formfill == "undefined")
				LP_to_formfill = [];
			LP_to_formfill.promocode = "promocode";
			K = o;
			if (K.length == 5)
				J = K;
			J != "en-US" && lpFormFillInitRegexps(J);
			U = lpffregexps[J];
			W = lpfftextregexps[J]
		}
		K = A = I = null;
		try {
			if (c)
				if (k.getSelection) {
					I = k.getSelection();
					if (I.toString() == "")
						I = A = K = null;
					else {
						if (I.getRangeAt)
							A = I.getRangeAt(0);
						if (b.createRange)
							K = b.createRange()
					}
				} else if (b.selection) {
					I = b.selection.createRange();
					K = b.body.createTextRange();
					if (I.text == "")
						I = A = K = null
				}
		} catch (S) {
			I = A = K = null
		}
		D = {};
		D.value = 0;
		q = {};
		q.value = 0;
		var ca = {}, ba = {}, M = {}, N = {};
		ca.value = false;
		ba.value = false;
		M.value = false;
		N.value = false;
		for (u = 0; u < p.length + 1; u++) {
			var B = u < p.length ? p[u] : null, R;
			if (B != null)
				R = B.elements;
			else {
				R = [];
				var G = [ "input", "select", "textarea" ];
				for (y = 0; y < G.length; y++) {
					var O = b.getElementsByTagName(G[y]);
					for (T = 0; T < O.length; T++)
						if (typeof O[T].form == "unknown" || O[T].form == null)
							R[R.length] = O[T]
				}
			}
			if (typeof R != "undefined") {
				var s = {};
				s.value = 0;
				G = [];
				for (T = 0; T < U.length; T++)
					G[H[T]] = 0;
				var F = [], E = {};
				E.value = false;
				var fa = populateToFillForFormFill(R, a, s, G, F, E, c, I, A, K, q, U, H, W, D, e, ca, ba, M, N, k, J);
				if (fa == 0) {
					if (x) {
						x.m_checkfillformresult = false;
						x.m_checkfillformnumforms = p.length
					}
					return false
				} else if (fa == 1) {
					if (x) {
						x.m_checkfillformresult = true;
						x.m_checkfillformnumforms = p.length
					}
					return true
				}
				if (c) {
					E = "birthday";
					var v = "birthmonth";
					if (j && lpdec(j.country) == "US") {
						E = "birthmonth";
						v = "birthday"
					}
					s = [];
					if (J != "es-ES" && J != "es-MX" && J != "ca-ES" && J != "ja-JP") {
						s[s.length] = [ "name", "name", "name", "firstname", "middlename", "lastname" ];
						s[s.length] = [ "firstname", "firstname", "lastname", "firstname", "middlename", "lastname" ];
						s[s.length] = [ "firstname", "lastname", "lastname", "firstname", "middlename", "lastname" ];
						s[s.length] = [ "name", "name", "firstname", "lastname" ];
						s[s.length] = [ "name", "lastname", "firstname", "lastname" ];
						s[s.length] = [ "lastname", "lastname", "lastname", "firstname", "middlename", "lastname" ];
						s[s.length] = [ "lastname", "lastname", "firstname", "lastname" ];
						s[s.length] = [ "firstname", "firstname", "firstname", "lastname" ];
						s[s.length] = [ "firstname", "lastname", "firstname", "firstname", "middlename", "lastname" ];
						s[s.length] = [ "firstname", "name", "firstname", "lastname" ]
					} else {
						s[s.length] = [ "name", "lastname", "lastname", "firstname", "lastname", "lastname2" ];
						s[s.length] = [ "name", "lastname", "lastname2", "firstname", "lastname", "lastname2" ];
						s[s.length] = [ "name", "lastname", "firstname", "fulllastname" ];
						s[s.length] = [ "firstname", "lastname", "lastname", "firstname", "lastname", "lastname2" ];
						s[s.length] = [ "fulllastname", "fulllastname", "lastname", "lastname2" ];
						s[s.length] = [ "name", "name", "firstname", "lastname" ]
					}
					s[s.length] = [ "address", "address", "address", "address1", "address2", "address3" ];
					s[s.length] = [ "address2", "address2", "address", "address1", "address2", "address3" ];
					s[s.length] = [ "address1", "address3", "address2", "address1", "address2", "address3" ];
					s[s.length] = [ "address", "address", "address1", "address2" ];
					s[s.length] = [ "address", "address2", "address1", "address2" ];
					s[s.length] = [ "address1", "address1", "address1", "address2" ];
					s[s.length] = [ "address", "address1", "address1", "address2" ];
					s[s.length] = [ "address2", "address2", "address1", "address2" ];
					s[s.length] = [ "address1", "address3", "address1", "address2" ];
					s[s.length] = [ "address", "address3", "address1", "address2" ];
					s[s.length] = [ "ssn", "ssn", "ssn", "ssn1", "ssn2", "ssn3" ];
					s[s.length] = [ "zip", "zip", "zip1", "zip2" ];
					s[s.length] = [ "birthmonth", "birthdate", "birthyear", E, v, "birthyear" ];
					s[s.length] = [ "birthday", "birthday", "birthday", E, v, "birthyear" ];
					s[s.length] = [ "birthdate", "birthdate", "birthdate", E, v, "birthyear" ];
					s[s.length] = [ "birthdate", "birthdate", "birthyear", E, v, "birthyear" ];
					s[s.length] = [ "birthday", "birthday", E, v ];
					s[s.length] = [ "birthdate", "birthdate", E, v ];
					for (E = 1; E <= 4; E++) {
						v = "evephone";
						if (2 == E)
							v = "phone";
						if (3 == E)
							v = "fax";
						if (4 == E)
							v = "mobilephone";
						s[s.length] = [ v, v, v, v + "1", v + "2", v + "3" ];
						s[s.length] = [ v + "1", v + "2", v, v + "1", v + "2", v + "3" ];
						s[s.length] = [ v + "1", v + "1", v + "2", v + "1", v + "2", v + "3" ];
						s[s.length] = [ v + "1", v + "1", v + "1", v + "1", v + "2", v + "3" ];
						s[s.length] = [ v + "1", v, v, v + "1", v + "2", v + "3" ];
						s[s.length] = [ v, v, v + "2", v + "1", v + "2", v + "3" ];
						s[s.length] = [ v, v + "2", v + "3", v + "1", v + "2", v + "3" ];
						s[s.length] = [ v, v + "2", v, v + "1", v + "2", v + "3" ];
						s[s.length] = [ v, v + "3", v, v + "1", v + "2", v + "3" ];
						s[s.length] = [ v, v, v + "1", v + "23" ]
					}
					s[s.length] = [ "ccnum", "ccnum", "ccnum", "ccnum", "ccnum1", "ccnum2", "ccnum3", "ccnum4" ];
					s[s.length] = [ "ccnum", "ccnum", "ccnum", "ccnum1", "amexccnum2", "amexccnum3" ];
					s[s.length] = [ "ccexp", "ccexp", "ccexpmonth", "ccexpyear" ];
					s[s.length] = [ "ccexp", "ccexpyear", "ccexpmonth", "ccexpyear" ];
					s[s.length] = [ "ccexpyear", "ccexpyear", "ccexpmonth", "ccexpyear" ];
					s[s.length] = [ "ccstart", "ccstart", "ccstartmonth", "ccstartyear" ];
					s[s.length] = [ "ccstart", "ccstartyear", "ccstartmonth", "ccstartyear" ];
					s[s.length] = [ "cctype", "cctype", "cctype", "firstname", "middlename", "lastname" ];
					if (ba.value || ca.value || N.value || M.value) {
						E = true;
						for (y = 0; y < F.length; y++) {
							if (F[y].namematch == "country" && F[y].textmatch == "country")
								E = false;
							if (F[y].namematch == "state" && F[y].textmatch == "state")
								E = false
						}
						if (E) {
							E = [];
							v = [];
							for (y = 0; y < F.length; y++) {
								var $ = F[y].namematch, da = F[y].textmatch;
								if ("" != $)
									v[$] = 1;
								if ("" != da)
									E[da] = 1
							}
							var aa = array_size(v), Y = array_size(E);
							if (aa > Y)
								for (y = 0; y < F.length; y++)
									if (F[y].namematch)
										F[y].regexpname = F[y].namematch
						}
					}
					CheckForLoners(F);
					for (y = 0; y < F.length; y++) {
						var ea = F[y], C = ea.elt;
						if (lpIsVisible(C)) {
							var P = ea.regexpname;
							E = false;
							for (T = 0; T < s.length; T++) {
								var Z = s[T];
								if (Z.length % 2 == 0)
									if (P == Z[0]) {
										var V = Z.length / 2;
										if (!(y >= F.length - (V - 1)))
											if (!(Z[0] == "cctype" && Z[3] == "firstname" && (C.type == "select-one" || C.type == "radio"))) {
												for (v = 0; v < V; v++) {
													if (!check_size_or_maxlen(F[y + v].elt, Z[V + v]))
														break;
													if (v >= 1)
														if (F[y + v].regexpname != Z[v] || !F[y + v].last_field_filled)
															break
												}
												if (!(v < V)) {
													P = Z[V];
													for (v = 1; v < V; v++)
														F[y + v].regexpname = Z[V + v];
													E = true;
													break
												}
											}
									}
							}
							if (!E && P == "cctype" && C.type != "select-one" && C.type != "radio") {
								for ( var X = false, Q = 0; Q < F.length; Q++)
									if (F[Q].regexpname.indexOf("ccnum") == 0) {
										X = true;
										break
									}
								X || (P = "ccnum")
							} else if (!E && P == "bankacctnum") {
								v = E = X = false;
								for (Q = 0; Q < F.length; Q++)
									if (F[Q].regexpname.indexOf("ccnum") == 0) {
										X = true;
										break
									} else if (F[Q].regexpname.indexOf("cc") == 0)
										E = true;
									else if (F[Q].regexpname.indexOf("bank") == 0 && F[Q].regexpname != "bankacctnum") {
										v = true;
										break
									}
								if (!X && E && !v)
									P = "ccnum"
							} else if (!E && P == "cccsc") {
								X = false;
								for (Q = 0; Q < F.length; Q++)
									if (F[Q].regexpname.indexOf("ccnum") == 0) {
										X = true;
										break
									}
								if (!X)
									continue
							} else if (!E && P.indexOf("ccnum") == 0 && C.type == "select-one")
								P = "cctype";
							else if (P == "address3" && j.address3 == "" && j.city != "") {
								E = false;
								for (Q = 0; Q < F.length; Q++)
									if (F[Q].regexpname == "city") {
										E = true;
										break
									}
								E || (P = "city")
							} else if (P == "address" && C.type == "textarea") {
								E = false;
								for (Q = 0; Q < F.length; Q++)
									if (F[Q].regexpname == "city" || F[Q].regexpname == "county" || F[Q].regexpname == "state") {
										E = true;
										break
									}
								E || (P = "fulladdress")
							}
							if (typeof lpdonotoverwritefilledfields != "undefined" && lpdonotoverwritefilledfields)
								if (("email" == C.type || "text" == C.type || "password" == C.type || "textarea" == C.type || C.type == "tel") && C.value != "")
									continue;
								else if (C.type == "select-one" && C.selectedIndex != 0)
									continue;
								else if ((C.type == "checkbox" || C.type == "radio") && C.checked)
									continue;
							if (P.indexOf("cc") == 0)
								if (w && !z)
									continue;
								else if (!w || !z) {
									E = P;
									if (typeof lpffregexpparents[P] != "undefined")
										E = lpffregexpparents[P];
									else if (P == "cctype")
										E = "ccnum";
									if (j && typeof j[E] != "undefined" && j[E] != "") {
										if (!w) {
											z = lpConfirmYesNo(lpgs("InsecureSite", J)) ? true : false;
											w = true
										}
										if (!z)
											continue
									}
								}
							var ja = C.value;
							lpFillFormField(x, C, P, d, n, J, f, j, o);
							if (C.value != ja) {
								if (typeof G[P] == "undefined")
									G[P] = 0;
								G[P]++
							}
						}
					}
				}
			}
		}
		if (k && k.frames && (!c || I == null))
			for (u = 0; u < k.frames.length; u++)
				try {
					if (k.frames[u].document) {
						var ga = lpCheckFormFill(a, k.frames[u].document, c, e, d, g + 1, k.frames[u].window, n);
						if (ga && !c) {
							if (x) {
								x.m_checkfillformresult = ga;
								x.m_checkfillformnumforms = p.length
							}
							return ga
						}
					}
				} catch (la) {
				}
		c && typeof lploglogins != "undefined" && lploglogins && g == 1 && lplogformfill(d)
	} catch (ha) {
		lpReportError("Failure with checking formfill: " + ha + " ln: " + ha.lineNumber, r)
	}
	if (!c) {
		if (x) {
			x.m_checkfillformresult = false;
			x.m_checkfillformnumforms = p.length
		}
		return false
	}
}
function DoFillReplace(a, b) {
	for ( var c = a[0], e = 0; e < a.length; e++)
		for ( var d = 0; d < b.length; d++)
			if (b[d].regexpname == a[e]) {
				b[d].regexpname = c;
				if (b[d].namematch == a[e])
					b[d].namematch = c;
				if (b[d].textmatch == a[e])
					b[d].textmatch = c
			}
}
function CheckForLoners(a) {
	var b = [];
	b[b.length] = [ "birthdate", "birthday", "birthmonth" ];
	for ( var c = "", e = 0; e < a.length; e++)
		c += "," + a[e].regexpname;
	for (e = 0; e < b.length; e++) {
		for ( var d = 0, g = 1; g < b[e].length; g++)
			d += c.indexOf("," + b[e][g]) == -1 ? 0 : 1;
		d == 1 && DoFillReplace(b[e], a)
	}
}
function populateToFillForFormFill(a, b, c, e, d, g, k, n, o, f, r, q, x, j, p, u, w, z, J, H, D, U) {
	for ( var W = a.length, K = 0, y = 0; y < W; y++) {
		var I = false, A = a[y];
		if ("email" == A.type || A.type == "text" || A.type == "password" || A.type == "select-one" || A.type == "textarea" || A.type == "radio" || A.type == "tel")
			if (!(A.type == "select-one" && A.disabled == true)) {
				if (++K > 100)
					break;
				var T = getname(A), S = false;
				if (T != "") {
					try {
						if (k && n != null)
							if (D.navigator.userAgent.indexOf("Opera") != -1) {
								f.setStart(A, 0);
								f.setEnd(A, 0);
								var ca = o.compareBoundaryPoints(Range.START_TO_START, f), ba = o.compareBoundaryPoints(Range.END_TO_END, f);
								if (ca > 0 || ba < 0)
									continue
							} else if (typeof n.containsNode == "function") {
								if (!n.containsNode(A, true))
									continue
							} else if (f != null && typeof f.moveToElementText != "undefined") {
								var M = A;
								if (M.type == "select-one") {
									for ( var N = M.previousSibling, B = false; N;) {
										if (N.nodeType == 1 && N.tagName != "SELECT") {
											M = N;
											B = true;
											break
										}
										N = N.previousSibling
									}
									if (!B)
										M = M.parentNode
								}
								f.moveToElementText(M);
								ca = n.compareEndPoints("StartToStart", f);
								ba = n.compareEndPoints("EndToEnd", f);
								if (ca > 0 || ba < 0)
									continue
							}
					} catch (R) {
					}
					var G = 0, O = 0;
					if (typeof A.size != "undefined")
						G = parseInt(A.size);
					if (typeof A.maxLength != "undefined")
						O = parseInt(A.maxLength);
					if (G <= 0 && O <= 0 && A.style) {
						M = A.style.width;
						if (M.match(/^\d+px$/)) {
							M = parseInt(M.substring(0, M.length - 2));
							if (M % 10 == 0)
								G = M / 10
						}
					}
					var s = true;
					M = [];
					var F = [];
					try {
						var E = A.getAttribute("autocompletetype");
						if (typeof E == "string" && E != "") {
							var fa = E.split(" ");
							B = "";
							for ( var v = 0; v < fa.length; v++) {
								switch (fa[v]) {
								case "given-name":
									B = "firstname";
									break;
								case "middle-name":
									B = "middlename";
									break;
								case "middle-initial":
									B = "middleinitial";
									break;
								case "surname":
									B = "lastname";
									break;
								case "name-full":
									B = "name";
									break;
								case "name-prefix":
									B = "title";
									break;
								case "street-address":
									B = "address";
									break;
								case "address-line1":
									B = "address1";
									break;
								case "address-line2":
									B = "address2";
									break;
								case "address-line3":
									B = "address3";
									break;
								case "locality":
									B = "city";
									break;
								case "city":
									B = "city";
									break;
								case "administrative-area":
									B = "state";
									break;
								case "state":
									B = "state";
									break;
								case "province":
									B = "state";
									break;
								case "region":
									B = "state";
									break;
								case "postal-code":
									B = "zip";
									break;
								case "country":
									B = "country";
									break;
								case "email":
									B = "email";
									break;
								case "phone-full":
									B = "fullphone";
									break;
								case "phone-country-code":
									B = "phonecc";
									break;
								case "phone-national":
									B = "phone";
									break;
								case "phone-area-code":
									B = "phone1";
									break;
								case "phone-local":
									B = "phone23";
									break;
								case "phone-local-prefix":
									B = "phone2";
									break;
								case "phone-local-suffix":
									B = "phone3";
									break;
								case "phone-extension":
									B = "phoneext";
									break;
								case "fax-full":
									B = "fullfax";
									break;
								case "fax-country-code":
									B = "faxcc";
									break;
								case "fax-national":
									B = "fax";
									break;
								case "fax-area-code":
									B = "fax1";
									break;
								case "fax-local":
									B = "fax23";
									break;
								case "fax-local-prefix":
									B = "fax2";
									break;
								case "fax-local-suffix":
									B = "fax3";
									break;
								case "fax-extension":
									B = "faxphoneext";
									break;
								case "cc-full-name":
									B = "ccname";
									break;
								case "cc-given-name":
									B = "ccfirstname";
									break;
								case "cc-middle-name":
									B = "ccmiddlename";
									break;
								case "cc-surname":
									B = "cclastname";
									break;
								case "cc-number":
									B = "ccnum";
									break;
								case "cc-exp-month":
									B = "ccexpmonth";
									break;
								case "cc-exp-year":
									B = "ccexpyear";
									break;
								case "cc-exp":
									B = "ccexp";
									break;
								case "cc-csc":
									B = "cccsc";
									break;
								case "language":
									B = "language";
									break;
								case "birthday":
									B = "birthdate";
									break;
								case "birthday-month":
									B = "birthmonth";
									break;
								case "birthday-year":
									B = "birthyear";
									break;
								case "birthday-day":
									B = "birthday";
									break;
								case "organization":
									B = "company";
									break;
								case "gender":
									B = "gender"
								}
								if (B != "") {
									M[0] = F[0] = B;
									if (!k) {
										r.value++;
										c.value++;
										if (++p.value >= 3) {
											if (!u && (typeof lp_notification_exists == "undefined" || !lp_notification_exists(b, "addconfirm")))
												lp_showNotification("FillableFormDetected", b, 0, "formfill");
											if (b)
												b.contentDocument.ffidindex = -1;
											else
												document.ffidindex = -1;
											return true
										}
									}
									break
								}
							}
						}
					} catch ($) {
					}
					if (M.length == 0) {
						var da = B = false, aa = "";
						if (k || ++r.value <= 5)
							if (k)
								aa = lpGetTextBeforeFormField(A);
						if (!k && r.value > 20)
							return false;
						var Y = 2, ea = 1;
						k || (Y = ea = aa != "" ? 2 : 1);
						if (typeof q != "undefined" && typeof q.length != "undefined")
							for (v = 0; v < q.length && s && !B; v++)
								if (q[v] != null) {
									var C = x[v];
									if (!(A.type == "radio" && C != "gender" && C != "cctype" && C.indexOf("customfield") != 0))
										if (!(A.type == "select-one" && C != "state" && C != "country" && C != "cctype" && C != "timezone" && C != "city" && C.indexOf("birth") != 0 && C != "title" && C.indexOf("ccexp") != 0 && C.indexOf("ccstart") != 0 && C != "gender" && C != "age" && C.indexOf("customfield") != 0))
											if (!(A.type == "password" && C.indexOf("ccnum") != 0 && C != "cccsc" && C != "ccissuenum" && C != "cctype" && C != "bankacctnum" && C.indexOf("customfield") != 0))
												if (!((A.type == "text" || A.type == "textarea" || "email" == A.type || A.type == "tel") && (C == "cctype" || C == "timezone" || C == "gender")))
													if (check_size_or_maxlen(A, C, true, G, O))
														if (!(C.indexOf("address") == 0 && O > 0 && O < 15)) {
															for ( var P = false, Z = false, V = Y; V >= ea; V--) {
																if (V == 1 && !P && F.length > 0 && A.type != "select-one")
																	break;
																var X;
																if (V == 1)
																	X = T;
																else if (V == 2) {
																	X = aa;
																	if (X == "")
																		continue
																}
																var Q = 1 == V ? q[v] : j[v];
																if ((typeof e[C] == "undefined" || e[C] < 2) && regexp_match_c(Q, X)) {
																	if (V == 2 && (C == "evephone" || C == "mobilephone"))
																		da = true;
																	if (V == 2 && C == "phone" && da)
																		break;
																	if (!k && !S) {
																		if (!lpIsVisible(A)) {
																			s = false;
																			I = g.value;
																			break
																		}
																		S = true
																	}
																	if (lp_in_array(C, lpffdummyregexpnames)) {
																		if (typeof LP_to_formfill != "undefined" && typeof LP_to_formfill.promocode != "undefined")
																			if (RegExp(lpgs("ff_promocode_regexp", U), "i").exec(X)) {
																				p.value++;
																				c.value++;
																				C = "promocode"
																			}
																	} else {
																		p.value++;
																		c.value++
																	}
																	if (k)
																		if (V == 1) {
																			M[M.length] = C;
																			Z = true
																		} else {
																			F[F.length] = C;
																			P = true
																		}
																	else {
																		if (typeof e[C] == "undefined")
																			e[C] = 0;
																		e[C]++;
																		if (p.value >= 3) {
																			if (!u && (typeof lp_notification_exists == "undefined" || !lp_notification_exists(b, "addconfirm")))
																				lp_showNotification("FillableFormDetected", b, 0, "formfill");
																			if (b)
																				b.contentDocument.ffidindex = -1;
																			else
																				document.ffidindex = -1;
																			return true
																		}
																		B = true;
																		break
																	}
																}
															}
															if (P && Z)
																break
														}
								}
					}
					if (k && s) {
						S = [];
						for (G = 0; G < F.length; G++)
							if (lp_in_array(F[G], M))
								S[S.length] = F[G];
							else if (typeof lpffregexpparents[F[G]] != "undefined" && lp_in_array(lpffregexpparents[F[G]], M))
								S[S.length] = F[G];
						G = null;
						if (S.length > 0)
							G = S[0];
						else if (F.length > 0)
							G = F[0];
						else if (M.length > 0) {
							if (M[0].indexOf("ccnum") == 0 && A.type == "select-one")
								for (G = 1; G < M.length; G++)
									if (M[G].indexOf("ccexp") == 0) {
										M.shift();
										break
									}
							G = M[0]
						}
						if (G != null) {
							if (G == "name" && lp_in_array("name", S) && lp_in_array("company", F))
								G = "company";
							if (G == "ccexp" && A.type == "select-one" && lp_in_array("ccexp", F) && lp_in_array("cctype", M))
								if (A.options.length != 12 && A.options.length != 13) {
									for (I = 0; I < A.options.length; I++)
										if (A.options[I].value.match(/^(?:\d{1,2}|\d{4}|\d{2}\/?(?:\d{2}|\d{4}))$/) || A.options[I].text.match(/^(?:\d{1,2}|\d{4}|\d{2}\/?(?:\d{2}|\d{4}))$/))
											break;
									if (I == A.options.length)
										G = "cctype"
								}
							if (G == "ccexp" && A.type == "text" && lp_in_array("ccexp", F) && lp_in_array("cccsc", M) && typeof A.maxLength != "undefined" && A.maxLength >= 3 && A.maxLength <= 4)
								G = "cccsc";
							I = new lptofillinfo;
							I.elt = A;
							I.regexpname = G;
							I.last_field_filled = g.value;
							G = S = "";
							if (F.length > 0)
								G = F[0];
							if (M.length > 0) {
								if ("state" == M[0] && G != "state" && "select-one" == A.type)
									z.value = true;
								if ("country" == M[0] && G != "country" && "select-one" == A.type)
									w.value = true;
								if ("ccexpmonth" == M[0] && G != "ccexpmonth" && G != "ccexp" && "select-one" == A.type)
									J.value = true;
								if ("ccexpyear" == M[0] && G != "ccexpyear" && G != "ccexp" && "select-one" == A.type)
									H.value = true;
								S = M[0]
							}
							I.namematch = S;
							I.textmatch = G;
							d[d.length] = I;
							I = true
						}
					}
				}
				g.value = I
			}
	}
	return 2
}
function lpClearForms(a, b, c, e) {
	if (typeof c == "undefined" || c == null)
		c = 1;
	if (c > 10)
		return false;
	if (!a && !e || !b)
		return false;
	for ( var d = [ "input", "select" ], g = 0; g < d.length; g++)
		for ( var k = b.getElementsByTagName(d[g]), n = 0; n < k.length; n++) {
			var o = k[n];
			if (!o.readOnly && !o.disabled)
				if ("email" == o.type || o.type == "text" || o.type == "password" || o.type == "tel") {
					if (o.value != "") {
						o.value = "";
						fire_onchange(o)
					}
				} else if (o.type == "select-one") {
					if (o.selectedIndex != 0) {
						o.selectedIndex = 0;
						fire_onchange(o)
					}
				} else if (o.type == "radio" || o.type == "checkbox")
					if (o.checked) {
						o.checked = false;
						fire_onchange(o)
					}
		}
	if (typeof e == "undefined" || e == null)
		e = a.contentWindow;
	if (e && e.frames)
		for (g = 0; g < e.frames.length; g++)
			e.frames[g].document && lpClearForms(a, e.frames[g].document, c + 1, e.frames[g].window)
}
var g_lastmodifiedlocalefile = {}, g_overrideregexps = {};
function lpFormFillInitRegexps(a) {
	var b = false;
	if (typeof lpLastModifiedFile == "function") {
		var c = lpLastModifiedFile(a + ".properties");
		if (c)
			if (typeof g_lastmodifiedlocalefile[a] == "undefined" || g_lastmodifiedlocalefile[a] < c) {
				b = true;
				g_lastmodifiedlocalefile[a] = c;
				g_overrideregexps[a] = {};
				if (c = lpReadFile(a + ".properties", null, 1)) {
					c = c.replace("\r", "");
					var e = c.split("\n"), d = e.length;
					for (c = 0; c < d; ++c) {
						var g = e[c];
						if (g.indexOf("ff_") == 0) {
							var k = g.indexOf("=");
							if (k != -1) {
								var n = g.substring(0, k);
								g = g.substring(k + 1);
								g_overrideregexps[a][n] = g
							}
						}
					}
				}
			}
	}
	if (b || typeof lpffregexps[a] == "undefined") {
		lpffregexps[a] = [];
		lpfftextregexps[a] = []
	}
	if (!(lpffregexps[a].length > 0)) {
		b = false;
		for (c = 0; c < lpffregexpnames.length; c++) {
			e = "ff_" + lpffregexpnames[c] + "_regexp";
			d = lpgs(e, a, true);
			if (d != e)
				b = true;
			if (typeof g_overrideregexps[a] != "undefined" && typeof g_overrideregexps[a][e] != "undefined")
				d = g_overrideregexps[a][e];
			lpffregexps[a][c] = d.length ? RegExp(d, "i") : null;
			if (lpffregexpnames[c] == "lastname2")
				lastname2_index = c;
			if (lpffregexpnames[c] == "lastname3")
				lastname3_index = c;
			e = "ff_text_" + lpffregexpnames[c] + "_regexp";
			d = lpgs(e, a, true);
			if (typeof g_overrideregexps[a] != "undefined" && typeof g_overrideregexps[a][e] != "undefined")
				d = g_overrideregexps[a][e];
			lpfftextregexps[a][c] = d.length && d != e ? RegExp(d, "i") : lpffregexps[a][c]
		}
		b || delete lpffregexps[a]
	}
}
function lpGetTextBeforeFormField(a) {
	var b = "";
	try {
		if (a.id != "" && typeof a.ownerDocument != "undefined" && a.ownerDocument != null)
			for ( var c = a.ownerDocument.getElementsByTagName("label"), e = 0; e < c.length; e++)
				if (c[e].htmlFor == a.id) {
					var d = strip(lpGetText(c[e], a, false, true));
					if (d.length >= 2)
						return d;
					break
				}
		var g = a.parentNode;
		if (g && (g.tagName == "DIV" || g.tagName == "SPAN"))
			g = g.parentNode;
		if (g && "TD" == g.tagName) {
			var k = strip(lpGetText(g, a, false, true));
			if (k.length >= 2)
				return k;
			var n = g.parentNode, o = strip(lpGetText(n, a, false, true));
			if (o.length >= 2)
				return o;
			k = c = -1;
			var f = g.offsetParent;
			if (f)
				for (o = 0; o < f.rows.length; o++)
					if (n == f.rows[o]) {
						c = o;
						break
					}
			for (o = 0; o < n.cells.length; o++)
				if (typeof n.cells[o] != "undefined" && g == n.cells[o]) {
					k = o;
					break
				}
			g = 0;
			if (c > 0 && k != -1) {
				for (e = o = n = 0; e <= k; e++) {
					var r = f.rows[c].cells[e], q = 1;
					if (r && typeof r.colSpan == "number")
						q = r.colSpan;
					if (e < k)
						n += q;
					else
						o = n + q - 1
				}
				var x = 0;
				for (e = 0; e <= o; e++) {
					r = f.rows[c - 1].cells[e];
					q = 1;
					if (r && typeof r.colSpan == "number")
						q = r.colSpan;
					var j = 1;
					if (r && typeof r.rowSpan == "number")
						j = r.rowSpan;
					if (j > 1) {
						n += j - 1;
						o += j - 1
					}
					j = x;
					var p = x + q - 1;
					if (n >= j && n <= p || o >= j && o <= p)
						if (r) {
							d = strip(lpGetText(r, a, false, true));
							if (d.length >= 2) {
								b = d;
								g = 1;
								break
							}
						}
					x += q
				}
			}
			if (!g && c != -1 && k != -1)
				if (r = f.rows[c].cells[0]) {
					d = strip(lpGetText(r, a, false, true));
					if (d.length >= 2)
						b = d
				}
		}
	} catch (u) {
	}
	if (b == "")
		b = lpGetTextBeforeFormField_orig(a);
	return b
}
function innerHTMLParse(a, b) {
	var c = "", e = a.innerHTML, d = RegExp("<(input|select|textarea)[^>]+name=[\"']?" + lp_regexp_quote(lpxmlescape(getname(b))) + "[\"']?[^>]*>", "i");
	d = d.exec(e);
	if (!d) {
		d = RegExp("<(input|select|textarea)[^>]+id=[\"']?" + lp_regexp_quote(lpxmlescape(getname(b))) + "[\"']?[^>]*>", "i");
		d = d.exec(e);
		if (!d)
			return ""
	}
	var g = e.indexOf(d[0]);
	d = 0;
	var k = g > 1001 ? g - 1001 : 0;
	for (g -= 1; g >= k; g--) {
		var n = e.charAt(g);
		if (n == ">") {
			if (d <= 0) {
				c = c.replace(/&nbsp;/, " ");
				c = strip(c);
				if (c.length > 2)
					return c;
				c = ""
			}
			d++
		} else if (n == "<")
			d > 0 && d--;
		else if (d <= 0)
			c = n + c
	}
	c = c.replace(/&nbsp;/, " ");
	c = strip(c);
	if (c.length > 2)
		return c;
	return ""
}
function lpGetTextBeforeFormField_orig(a) {
	if (getname(a) == "")
		return "";
	for ( var b = a, c = "", e = 0; e < 10; e++) {
		if (!b.parentNode)
			break;
		b = b.parentNode;
		c = strip(lpGetText(b, a));
		if (c.length > 200)
			return innerHTMLParse(b, a);
		if (c.length >= 2)
			break
	}
	return c
}
function check_size_or_maxlen(a, b, c, e, d) {
	if (b == "ssn1" || b == "ssn2" || b == "ssn3" || b == "ccnum1" || b == "ccnum2" || b == "ccnum3" || b == "ccnum4" || b == "phone1" || b == "phone2" || b == "phone3" || b == "phone23" || b == "evephone1" || b == "evephone2" || b == "evephone3" || b == "evephone23" || b == "mobilephone1" || b == "mobilephone2" || b == "mobilephone3" || b == "mobilephone23" || b == "fax1" || b == "fax2" || b == "fax3" || b == "fax23" || b == "zip1" || b == "zip2" || b == "amexccnum2" || b == "amexccnum3") {
		if (typeof e == "undefined" || typeof d == "undefined") {
			d = e = 0;
			if (typeof a.size != "undefined")
				e = parseInt(a.size);
			if (typeof a.maxLength != "undefined")
				d = parseInt(a.maxLength);
			if (e <= 0 && d <= 0 && a.style) {
				a = a.style.width;
				if (a.match(/^\d+px$/)) {
					a = parseInt(a.substring(0, a.length - 2));
					if (a % 10 == 0)
						e = a / 10
				}
			}
		}
		if (b == "ssn2")
			b = a = 2;
		else if (b == "ssn1" || b == "phone1" || b == "phone2" || b == "fax1" || b == "fax2" || b == "evephone1" || b == "evephone2" || b == "mobilephone1" || b == "mobilephone2")
			b = a = 3;
		else if (b == "zip1") {
			b = 5;
			a = 2
		} else if (b == "phone23" || b == "fax23" || b == "evephone23" || b == "mobilephone23") {
			b = 8;
			a = 7
		} else if (b == "ccnum4" || b == "zip2") {
			b = 4;
			a = 3
		} else if (b == "amexccnum2")
			b = a = 6;
		else if (b == "amexccnum3")
			b = a = 5;
		else if (b == "phone3" || b == "fax3" || b == "mobilephone3" || b == "evephone3") {
			b = 5;
			a = 4
		} else
			b = a = 4;
		if ((e <= 0 || e > b) && (d <= 0 || d > b))
			return false;
		if (c && d > 0 && d < a)
			return false
	}
	return true
}
var g_allowtruncate = true;
function lpFillFormField(a, b, c, e, d, g, k, n, o) {
	if (k = typeof k != "undefined" ? k : false)
		g_allowtruncate = false;
	try {
		if (d && c.indexOf("cc") == 0)
			e = d;
		d = null;
		if (e)
			for ( var f = 0; f < lpformfills.length; f++) {
				if (lpformfills[f].ffid == e) {
					d = lpformfills[f];
					break
				}
			}
		else if (k) {
			if (k)
				d = n
		} else
			d = lpformfills[0];
		if (d)
			if (!(b.readOnly || b.disabled)) {
				if (a)
					a.formfillffid = e;
				e = n = 0;
				if (typeof b.size != "undefined")
					n = parseInt(b.size);
				if (typeof b.maxLength != "undefined")
					e = parseInt(b.maxLength);
				check_size_or_maxlen(b, c) || (c = c.replace(/\d+$/, ""));
				var r = b.value;
				if (c.indexOf("customfield") == 0) {
					var q = parseInt(c.substring(11));
					d.customfields.length > q && lpSetValue(a, b, lpdec(d.customfields[q].value))
				}
				var x = b.type == "select-one" && (b.options[0].value.match(/^\d{4}$/) || b.options.length > 1 && b.options[1].value.match(/^\d{4}$/));
				if (c == "birthmonth" && b.type == "select-one" && b.options.length >= 28)
					c = x ? "birthyear" : "birthday";
				else if (c == "birthday" && b.type == "select-one" && b.options.length < 28)
					c = "birthmonth";
				else if (c == "birthday" && b.type == "select-one" && x)
					c = "birthyear";
				else if (c == "birthyear" && b.type == "select-one" && b.options.length > 0 && b.options[0].value.match(/^\d$/) && b.options[0].value != 0)
					c = "birthday";
				else if (c == "birthyear" && b.type == "select-one" && b.options.length < 35)
					c = b.options.length > 12 ? "birthday" : "birthmonth";
				if (c == "ccexpmonth" && b.type == "select-one" && b.options.length > 0 && (b.options[b.options.length - 1].value.match(/^\d{4}$/) || b.options[b.options.length - 1].text.match(/^\d{4}$/)))
					c = "ccexpyear";
				if (c == "cctype" && b.type == "select-one" && b.options.length >= 100)
					for (f = 0; f < b.options.length; f++)
						if (b.options[f].value == "US" || b.options[f].value == "USA") {
							c = "country";
							break
						}
				if (k) {
					f = {
					title : 1,
					name : 1,
					firstname : 1,
					middlename : 1,
					middleinitial : 1,
					lastname : 1,
					username : 1,
					maiden : 1,
					birthdate : 1,
					birthday : 1,
					birthmonth : 1,
					birthyear : 1,
					age : 1,
					ssn : 1,
					ssn1 : 1,
					ssn2 : 1,
					ssn3 : 1,
					company : 1,
					addrbookname : 1,
					address : 1,
					address1 : 1,
					address2 : 1,
					address3 : 1,
					city : 1,
					housenumbername : 1,
					housenumber : 1,
					housename : 1,
					county : 1,
					state : 1,
					zip : 1,
					zip1 : 1,
					zip2 : 1,
					country : 1,
					phone : 1,
					phone1 : 1,
					phone2 : 1,
					phone3 : 1,
					phone23 : 1,
					phoneext : 1,
					fax : 1,
					fax1 : 1,
					fax2 : 1,
					fax3 : 1,
					fax23 : 1,
					evephone : 1,
					evephone1 : 1,
					evephone2 : 1,
					evephone3 : 1,
					evephone23 : 1,
					mobilephone : 1,
					mobilephone1 : 1,
					mobilephone2 : 1,
					mobilephone3 : 1,
					mobilephone23 : 1,
					ccname : 1,
					ccnum : 1,
					ccnum1 : 1,
					ccnum2 : 1,
					ccnum3 : 1,
					ccnum4 : 1,
					ccstart : 1,
					ccstartmonth : 1,
					ccstartyear : 1,
					ccexp : 1,
					ccexpmonth : 1,
					ccexpyear : 1,
					cccsc : 1,
					ccissuenum : 1,
					cctype : 1,
					ccphone : 1,
					bankname : 1,
					bankacctnum : 1,
					bankroutingnum : 1,
					email : 1,
					emailalert : 1,
					search : 1,
					securityanswer : 1,
					captcha : 1,
					combineddummy : 1,
					comments : 1,
					promocode : 1,
					invoice : 1,
					currpass : 1,
					gender : 1,
					timezone : 1
					};
					switch (o) {
					case "es-ES":
					case "es-MX":
						f.lastname2 = 1;
						break;
					case "ja-JP":
						f.mobileemail = 1;
						f.firstname = "namestdfirst";
						f.firstname2 = "namefurfirst";
						f.firstname3 = "nameromfirst";
						f.lastname = "namestdlast";
						f.lastname2 = "namefurlast";
						f.lastname3 = "nameromlast"
					}
					var j = typeof f[c] != "undefined" ? f[c] == 1 ? c : f[c] : "UNKNOWN:" + c;
					lpSetValue(a, b, j)
				} else
					switch (c) {
					case "firstname":
						lpSetValue(a, b, lpdec(d.firstname));
						break;
					case "firstname2":
						lpSetValue(a, b, lpdec(d.firstname2));
						break;
					case "firstname3":
						lpSetValue(a, b, lpdec(d.firstname3));
						break;
					case "lastname":
						lpSetValue(a, b, lpdec(d.lastname));
						break;
					case "lastname2":
						lpSetValue(a, b, lpdec(d.lastname2));
						break;
					case "lastname3":
						lpSetValue(a, b, lpdec(d.lastname3));
						break;
					case "email":
						lpSetValue(a, b, lpdec(d.email));
						break;
					case "mobileemail":
						lpSetValue(a, b, lpdec(d.mobileemail));
						break;
					case "company":
						lpSetValue(a, b, lpdec(d.company));
						break;
					case "address1":
						lpSetValue(a, b, lpdec(d.address1));
						break;
					case "address2":
						lpSetValue(a, b, lpdec(d.address2), false, false, d.address1 != "" ? true : false);
						break;
					case "address3":
						lpSetValue(a, b, lpdec(d.address3), false, false, d.address1 != "" ? true : false);
						break;
					case "username":
						lpSetValue(a, b, lpdec(d.username), true);
						break;
					case "phoneext":
						lpSetValue(a, b, lpdec(d.phoneext), false, false, d.phone != "");
						break;
					case "bankname":
						lpSetValue(a, b, lpdec(d.bankname));
						break;
					case "bankacctnum":
						lpSetValue(a, b, lpdec(d.bankacctnum));
						break;
					case "bankroutingnum":
						lpSetValue(a, b, lpdec(d.bankroutingnum));
						break;
					case "county":
						lpSetValue(a, b, lpdec(d.county));
						break;
					case "ccname":
						lpSetValue(a, b, lpdec(d.ccname));
						break;
					case "ccissuenum":
						lpSetValue(a, b, lpdec(d.ccissuenum), true);
						break;
					case "fullmobilephone":
						lpSetValue(a, b, lpdec(d.mobilephone), true);
						break;
					case "fullevephone":
						lpSetValue(a, b, lpdec(d.evephone), true);
						break;
					case "fullphone":
						lpSetValue(a, b, lpdec(d.phone), true);
						break;
					case "fullfax":
						lpSetValue(a, b, lpdec(d.fax), true);
						break;
					case "securityanswer":
						lpSetValue(a, b, "");
						break;
					case "promocode":
						lpSetValue(a, b, typeof LP_to_formfill != "undefined" && typeof LP_to_formfill.promocode != "undefined" ? LP_to_formfill.promocode : "");
						break;
					case "maiden":
						lpSetValue(a, b, "");
						break;
					case "ccphone":
						lpSetValue(a, b, "");
						break;
					case "comments":
						lpSetValue(a, b, "");
						break;
					case "invoice":
						lpSetValue(a, b, "");
						break;
					case "addrbookname":
						lpSetValue(a, b, "");
						break;
					case "emailalert":
						lpSetValue(a, b, "");
						break;
					case "combineddummy":
						lpSetValue(a, b, "");
						break;
					case "language":
						j = lpdec(d.profilelanguage);
						if (b.type == "select-one") {
							if (j == "")
								break;
							j = j.toLowerCase();
							var p = j.replace("-", "_");
							a = false;
							for (f = 0; f < b.options.length; f++)
								if (b.options[f].value.toLowerCase() == j || b.options[f].text.toLowerCase() == j || b.options[f].value.toLowerCase() == p || b.options[f].text.toLowerCase() == p) {
									b.selectedIndex = f;
									a = true;
									break
								}
							if (!a) {
								j = j.substring(0, 2);
								for (f = 0; f < b.options.length; f++)
									if (b.options[f].value.toLowerCase().indexOf(j) == 0 || b.options[f].text.toLowerCase().indexOf(j) == 0) {
										b.selectedIndex = f;
										break
									}
							}
						} else
							lpSetValue(a, b, j);
						break;
					case "ccfirstname":
						var u = lpdec(d.ccname);
						if (u != "") {
							var w = u.split(" ");
							w.length > 0 && lpSetValue(a, b, w[0])
						}
						break;
					case "ccmiddlename":
						u = lpdec(d.ccname);
						if (u != "") {
							w = u.split(" ");
							w.length > 2 && lpSetValue(a, b, w[1])
						}
						break;
					case "cclastname":
						u = lpdec(d.ccname);
						if (u != "") {
							w = u.split(" ");
							w.length > 1 && lpSetValue(a, b, w[w.length - 1])
						}
						break;
					case "evephoneext":
						f = "";
						if (typeof d.evephoneext != "undefined")
							f = d.evephoneext;
						else if (typeof d.eveext != "undefined")
							f = d.eveext;
						lpSetValue(a, b, lpdec(f), false, false, d.evephone != "");
						break;
					case "faxphoneext":
						f = "";
						if (typeof d.faxphoneext != "undefined")
							f = d.faxphoneext;
						else if (typeof d.faxext != "undefined")
							f = d.faxext;
						lpSetValue(a, b, lpdec(f), false, false, d.fax != "");
						break;
					case "mobilephoneext":
						f = "";
						if (typeof d.mobilephoneext != "undefined")
							f = d.mobilephoneext;
						else if (typeof d.mobileext != "undefined")
							f = d.mobileext;
						lpSetValue(a, b, lpdec(f), false, false, d.mobilephone != "");
						break;
					case "timezone":
						j = lpdec(d.timezone);
						if (b.type == "select-one") {
							if (j == "")
								break;
							var z = j.match(/^([-+]?\d{2}):(\d{2}),(\d)$/);
							if (z) {
								var J = parseInt(z[1]), H = parseInt(z[2]);
								parseInt(z[3]);
								p = J + H / 60;
								var D = "GMT\\s*" + (J < 0 ? "-" : "\\+") + "\\s*" + (Math.abs(J) < 10 ? "0?" : "") + Math.abs(J);
								if (H != 0)
									D += ":" + H;
								var U = RegExp(D);
								for (f = 0; f < b.options.length; f++)
									if (b.options[f].value == j || b.options[f].text == j || b.options[f].value == p || b.options[f].text == p || U.exec(b.options[f].value) || U.exec(b.options[f].text)) {
										b.selectedIndex = f;
										break
									}
							}
						} else
							lpSetValue(a, b, j);
						break;
					case "ccnum":
						f = false;
						if (4 == e || 3 == e)
							f = true;
						if (!f) {
							var W = lpdec(d.ccnum);
							lpSetValue(a, b, W);
							break
						}
					case "cccsc":
						lpSetValue(a, b, lpdec(d.cccsc), true);
						break;
					case "zip":
						j = lpdec(d.zip);
						if (j.match(/^\d{5}-?(?:\d{4})?$/)) {
							if (e > 0 && e < j.length)
								j = e == 9 && j.length == 10 ? j.substring(0, 5) + j.substring(6, 10) : e == 4 ? j.length >= 9 ? j.substring(j.length - 4) : "" : j.substring(0, 5)
						} else if (e > 0 && e < j.length)
							j = j.replace(/[^A-Za-z0-9]/g, "");
						lpSetValue(a, b, j);
						break;
					case "city":
						j = lpdec(d.city);
						if (b.type == "select-one") {
							if (j == "")
								break;
							j = j.toLowerCase();
							for (f = 0; f < b.options.length; f++)
								if (b.options[f].value.toLowerCase() == j || b.options[f].text.toLowerCase() == j) {
									b.selectedIndex = f;
									break
								}
						} else
							lpSetValue(a, b, j);
						break;
					case "ssn":
						var K = lpdec(d.ssn);
						if (4 == e) {
							var y = K.replace(/\D/g, "");
							if (y.length == 9)
								K = y.substring(5, 9);
							else
								break
						} else if (e > 0 && e < 11)
							K = K.replace(/-/g, "");
						lpSetValue(a, b, K);
						break;
					case "name":
						j = lpdec(d.firstname) + (d.firstname != "" && d.lastname != "" ? " " : "") + lpdec(d.lastname);
						lpSetValue(a, b, j);
						break;
					case "fulllastname":
						j = lpdec(d.lastname) + (d.lastname != "" && d.lastname2 != "" ? " " : "") + lpdec(d.lastname2);
						lpSetValue(a, b, j);
						break;
					case "ssn1":
						K = lpdec(d.ssn);
						y = K.replace(/\D/g, "");
						if (y.length == 9) {
							j = y.substring(0, 3);
							lpSetValue(a, b, j)
						}
						break;
					case "ssn2":
						K = lpdec(d.ssn);
						y = K.replace(/\D/g, "");
						if (y.length == 9) {
							j = y.substring(3, 5);
							lpSetValue(a, b, j)
						}
						break;
					case "ssn3":
						K = lpdec(d.ssn);
						y = K.replace(/\D/g, "");
						if (y.length == 9) {
							j = y.substring(5, 9);
							lpSetValue(a, b, j)
						}
						break;
					case "birthmonth":
						if (d.birthday == "")
							break;
						j = lpdec(d.birthday).substring(5, 7);
						if (b.type == "select-one") {
							p = j;
							if (p.charAt(0) == "0")
								p = p.substring(1);
							D = lpgs("month" + p, g).toLowerCase();
							var I = lpgs("mon" + p, g).toLowerCase();
							for (f = 0; f < b.options.length; f++)
								if (b.options[f].value.toLowerCase().indexOf(D) != -1 || b.options[f].value.toLowerCase().indexOf(I) != -1 || b.options[f].text.toLowerCase().indexOf(D) != -1 || b.options[f].text.toLowerCase().indexOf(I) != -1) {
									b.selectedIndex = f;
									break
								}
							if (f == b.options.length)
								for (f = 0; f < b.options.length; f++)
									if (b.options[f].value == j || b.options[f].value == p || b.options[f].text == j || b.options[f].text == p) {
										b.selectedIndex = f;
										break
									}
						} else
							lpSetValue(a, b, j);
						break;
					case "birthday":
						if (d.birthday == "")
							break;
						j = lpdec(d.birthday).substring(8, 10);
						if (b.type == "select-one") {
							p = j;
							if (p.charAt(0) == "0")
								p = p.substring(1);
							for (f = 0; f < b.options.length; f++)
								if (b.options[f].value == j || b.options[f].value == p || b.options[f].text == j || b.options[f].text == p) {
									b.selectedIndex = f;
									break
								}
						} else
							lpSetValue(a, b, j);
						break;
					case "birthyear":
						if (d.birthday == "")
							break;
						var A = lpdec(d.birthday);
						j = A.substring(0, 4);
						p = A.substring(2, 4);
						if (b.type == "select-one")
							for (f = 0; f < b.options.length; f++) {
								if (b.options[f].value == j || b.options[f].value == p || b.options[f].text == j || b.options[f].text == p) {
									b.selectedIndex = f;
									break
								}
							}
						else {
							if (2 == e)
								j = p;
							lpSetValue(a, b, j)
						}
						break;
					case "birthdate":
						A = lpdec(d.birthday);
						d && lpdec(d.country);
						if (A.length >= 4) {
							A = 4 == e ? A.substring(0, 4) : 2 == e ? A.substring(2, 4) : lpdec(d.country) == "US" ? A.substring(5, 7) + "/" + A.substring(8, 10) + "/" + A.substring(0, 4) : A.substring(8, 10) + "/" + A.substring(5, 7) + "/" + A.substring(0, 4);
							lpSetValue(a, b, A)
						}
						break;
					case "address":
					case "fulladdress":
						var T = b.type == "textarea" ? "\n" : " ", S = [ d.address1, d.address2, d.address3 ];
						if (c == "fulladdress") {
							S[S.length] = d.city;
							S[S.length] = d.county;
							S[S.length] = d.state
						}
						j = "";
						for (f = 0; f < S.length; f++)
							if (S[f] != "")
								j += (j != "" ? T : "") + lpdec(S[f]);
						lpSetValue(a, b, j);
						break;
					case "title":
						j = lpdec(d.title);
						if (b.type == "select-one") {
							if (j == "")
								break;
							z = a = "";
							for (f = 0; f < b.options.length; f++)
								if (b.options[f].value.toLowerCase() == j || b.options[f].value.toLowerCase().indexOf(j) != -1 || b.options[f].text.toLowerCase() == j || b.options[f].text.toLowerCase().indexOf(j) != -1) {
									if (!("" == a && "" == z))
										if (b.options[f].value.length <= a.length && b.options[f].text.length <= z.length) {
											if (!(b.options[f].value.length < a.length || b.options[f].text.length < z.length))
												continue
										} else
											continue;
									a = b.options[f].value;
									z = b.options[f].text;
									b.selectedIndex = f
								}
						} else {
							j = j.substring(0, 1).toUpperCase() + j.substring(1);
							lpSetValue(a, b, j)
						}
						break;
					case "state":
						j = lpdec(d.state);
						if (b.type == "select-one") {
							j = j.toLowerCase();
							if (j == "")
								break;
							p = lpdec(d.state_name).toLowerCase();
							for (f = 0; f < b.options.length; f++)
								if (b.options[f].value.toLowerCase() == j || b.options[f].value.toLowerCase() == p || b.options[f].text.toLowerCase() == j || b.options[f].text.toLowerCase() == p) {
									b.selectedIndex = f;
									break
								}
							if (f == b.options.length) {
								for (f = 0; f < b.options.length; f++)
									if (b.options[f].value.toLowerCase().indexOf(p) != -1 || b.options[f].text.toLowerCase().indexOf(p) != -1) {
										b.selectedIndex = f;
										break
									}
								if (f == b.options.length) {
									for (f = 0; f < b.options.length; f++)
										if (b.options[f].value.toLowerCase().indexOf(j) != -1 || b.options[f].text.toLowerCase().indexOf(j) != -1) {
											b.selectedIndex = f;
											break
										}
									if (f == b.options.length && j.length == 2) {
										D = j.charAt(0) + "." + j.charAt(1) + ".";
										for (f = 0; f < b.options.length; f++)
											if (b.options[f].value.toLowerCase().indexOf(D) != -1 || b.options[f].text.toLowerCase().indexOf(D) != -1) {
												b.selectedIndex = f;
												break
											}
									}
								}
							}
						} else
							lpSetValue(a, b, j);
						break;
					case "country":
						j = lpdec(d.country_name);
						if (b.type == "select-one") {
							j = j.toLowerCase();
							p = lpdec(d.country).toLowerCase();
							D = lpdec(d.country_cc3l).toLowerCase();
							I = D == "usa" ? "United States of America" : "";
							var ca = typeof d.country2 != "undefined" ? lpdec(d.country2).toLowerCase() : "";
							if (j == "" && p == "" && D == "" && ca == "")
								break;
							for (f = 0; f < b.options.length; f++)
								if (b.options[f].value != "")
									if (b.options[f].value.toLowerCase() == j || b.options[f].value.toLowerCase() == p || b.options[f].value.toLowerCase() == D || b.options[f].value.toLowerCase() == I || b.options[f].value.toLowerCase() == ca || b.options[f].text.toLowerCase() == j || b.options[f].text.toLowerCase() == p || b.options[f].text.toLowerCase() == D || b.options[f].text.toLowerCase() == I || b.options[f].text.toLowerCase() == ca) {
										b.selectedIndex = f;
										break
									}
						} else if (e == 3)
							lpSetValue(a, b, lpdec(d.country_cc3l));
						else
							e == 2 ? lpSetValue(a, b, lpdec(d.country)) : lpSetValue(a, b, j);
						break;
					case "cctype":
						j = lpGetCCType(lpdec(d.ccnum));
						if (j != "UNK")
							if (b.type == "select-one") {
								a = -1;
								for (f = 0; f < b.options.length; f++) {
									var ba = b.options[f].value.toUpperCase(), M = b.options[f].text.toUpperCase();
									if (ba == j || M == j) {
										b.selectedIndex = f;
										break
									}
									if (CCTypeMatch(j, ba) || CCTypeMatch(j, M))
										a = f
								}
								if (f == b.options.length && a != -1)
									b.selectedIndex = a
							} else if (b.type == "radio") {
								ba = b.value.toUpperCase();
								M = b.id.toUpperCase();
								a = false;
								if (CCTypeMatch(j, ba) || CCTypeMatch(j, M))
									a = true;
								if (!a) {
									var N = b.parentNode;
									if (N && N.childNodes) {
										for (f = 0; f < N.childNodes.length; f++)
											if (N.childNodes[f] == b)
												break;
										if (f < N.childNodes.length - 1) {
											var B = N.childNodes[f + 1];
											if (B.nodeType == 3 && CCTypeMatch(j, B.nodeValue))
												a = true;
											else if (B.nodeType == 3 && f < N.childNodes.length - 2 || B.nodeType == 1) {
												var R = B.nodeType == 1 ? N.childNodes[f + 1] : N.childNodes[f + 2];
												if (R.nodeType == 1 && R.tagName == "LABEL" && R.htmlFor == b.id) {
													var G = lpGetText(R, b);
													if (CCTypeMatch(j, G))
														a = true
												} else if (R.nodeType == 1 && R.tagName == "IMG" && typeof R.alt == "string") {
													G = R.alt;
													if (CCTypeMatch(j, G))
														a = true
												}
											}
										}
									}
								}
								if (a) {
									b.checked = true;
									b.click()
								}
							} else
								lpSetValue(a, b, j);
						break;
					case "ccexpmonth":
						if (d.ccexp == "")
							break;
						j = lpdec(d.ccexp).substring(5, 7);
						if (b.type == "select-one") {
							p = j;
							if (p.charAt(0) == "0")
								p = p.substring(1);
							D = lpgs("month" + p, g).toLowerCase();
							I = lpgs("mon" + p, g).toLowerCase();
							for (f = 0; f < b.options.length; f++)
								if (b.options[f].value.toLowerCase().indexOf(D) != -1 || b.options[f].value.toLowerCase().indexOf(I) != -1 || b.options[f].text.toLowerCase().indexOf(D) != -1 || b.options[f].text.toLowerCase().indexOf(I) != -1) {
									b.selectedIndex = f;
									break
								}
							if (f == b.options.length)
								for (f = 0; f < b.options.length; f++)
									if (b.options[f].value == j || b.options[f].value == p || b.options[f].text == j || b.options[f].text == p) {
										b.selectedIndex = f;
										break
									}
						} else
							lpSetValue(a, b, j);
						break;
					case "ccexpyear":
						if (d.ccexp == "")
							break;
						var O = lpdec(d.ccexp);
						j = O.substring(0, 4);
						if (b.type == "select-one") {
							p = O.substring(2, 4);
							for (f = 0; f < b.options.length; f++)
								if (b.options[f].value == j || b.options[f].value == p || b.options[f].text == j || b.options[f].text == p) {
									b.selectedIndex = f;
									break
								}
						} else
							lpSetValue(a, b, j, false, true);
						break;
					case "ccexp":
						O = lpdec(d.ccexp);
						j = O.length == 10 ? O.substring(5, 7) + "/" + O.substring(2, 4) : "";
						if (b.type == "select-one") {
							if (j == "")
								break;
							p = O.length == 10 ? O.substring(5, 7) + "/" + O.substring(0, 4) : "";
							D = O.length == 10 ? O.substring(5, 7) + O.substring(2, 4) : "";
							I = O.length == 10 ? O.substring(5, 7) + O.substring(0, 4) : "";
							for (f = 0; f < b.options.length; f++)
								if (b.options[f].value == j || b.options[f].value == p || b.options[f].value == D || b.options[f].value == I || b.options[f].text == j || b.options[f].text == p || b.options[f].text == D || b.options[f].text == I) {
									b.selectedIndex = f;
									break
								}
						} else {
							if (O.length == 10)
								if (4 == e)
									j = O.substring(5, 7) + O.substring(2, 4);
							lpSetValue(a, b, j)
						}
						break;
					case "ccstartmonth":
						if (d.ccstart == "")
							break;
						j = lpdec(d.ccstart).substring(5, 7);
						if (b.type == "select-one") {
							p = j;
							if (p.charAt(0) == "0")
								p = p.substring(1);
							D = lpgs("month" + p, g).toLowerCase();
							I = lpgs("mon" + p, g).toLowerCase();
							for (f = 0; f < b.options.length; f++)
								if (b.options[f].value.toLowerCase().indexOf(D) != -1 || b.options[f].value.toLowerCase().indexOf(I) != -1 || b.options[f].text.toLowerCase().indexOf(D) != -1 || b.options[f].text.toLowerCase().indexOf(I) != -1) {
									b.selectedIndex = f;
									break
								}
							if (f == b.options.length)
								for (f = 0; f < b.options.length; f++)
									if (b.options[f].value == j || b.options[f].value == p || b.options[f].text == j || b.options[f].text == p) {
										b.selectedIndex = f;
										break
									}
						} else
							lpSetValue(a, b, j);
						break;
					case "ccstartyear":
						if (d.ccstart == "")
							break;
						var s = lpdec(d.ccstart);
						j = s.substring(0, 4);
						if (b.type == "select-one") {
							p = s.substring(2, 4);
							for (f = 0; f < b.options.length; f++)
								if (b.options[f].value == j || b.options[f].value == p || b.options[f].text == j || b.options[f].text == p) {
									b.selectedIndex = f;
									break
								}
						} else
							lpSetValue(a, b, j, false, true);
						break;
					case "ccstart":
						s = lpdec(d.ccstart);
						j = s.length == 10 ? s.substring(5, 7) + "/" + s.substring(2, 4) : "";
						if (b.type == "select-one") {
							if (j == "")
								break;
							p = s.length == 10 ? s.substring(5, 7) + "/" + s.substring(0, 4) : "";
							D = s.length == 10 ? s.substring(5, 7) + s.substring(2, 4) : "";
							I = s.length == 10 ? s.substring(5, 7) + s.substring(0, 4) : "";
							for (f = 0; f < b.options.length; f++)
								if (b.options[f].value == j || b.options[f].value == p || b.options[f].value == D || b.options[f].value == I || b.options[f].text == j || b.options[f].text == p || b.options[f].text == D || b.options[f].text == I) {
									b.selectedIndex = f;
									break
								}
						} else {
							if (s.length == 10)
								if (4 == e)
									j = s.substring(5, 7) + s.substring(2, 4);
							lpSetValue(a, b, j)
						}
						break;
					case "ccnum1":
						j = lpdec(d.ccnum).substring(0, 4);
						lpSetValue(a, b, j);
						break;
					case "ccnum2":
						j = lpdec(d.ccnum).substring(4, 8);
						lpSetValue(a, b, j);
						break;
					case "ccnum3":
						j = lpdec(d.ccnum).substring(8, 12);
						lpSetValue(a, b, j);
						break;
					case "ccnum4":
						j = lpdec(d.ccnum).substring(12);
						lpSetValue(a, b, j);
						break;
					case "amexccnum2":
						j = lpdec(d.ccnum).substring(4, 10);
						lpSetValue(a, b, j);
						break;
					case "amexccnum3":
						j = lpdec(d.ccnum).substring(10, 15);
						lpSetValue(a, b, j);
						break;
					case "middlename":
						j = lpdec(d.middlename);
						var F = j.substring(0, 1);
						1 == e || 2 == e ? lpSetValue(a, b, F) : lpSetValue(a, b, j);
						break;
					case "middleinitial":
						j = lpdec(d.middlename).substring(0, 1);
						lpSetValue(a, b, j);
						break;
					case "mobilephone1":
					case "mobilephone2":
					case "mobilephone3":
					case "evephone1":
					case "evephone2":
					case "evephone3":
					case "phone1":
					case "phone2":
					case "phone3":
					case "fax1":
					case "fax2":
					case "fax3":
						var E = c.substring(0, c.length - 1), fa = c.substring(c.length - 1), v = d.phone;
						if ("evephone" == E)
							v = d.evephone;
						if ("mobilephone" == E)
							v = d.mobilephone;
						if ("fax" == E)
							v = d.fax;
						j = lpdec(v);
						if (j.length <= 3)
							j = "";
						y = j.replace(/\D/g, "");
						if (y.length == 10 && y.charAt(0) >= "2" && y.charAt(3) >= "2")
							y = "1" + y;
						if (y.length == 11 && y.charAt(0) == "1" && y.charAt(1) >= "2" && y.charAt(4) >= "2")
							switch (fa) {
							case "1":
								lpSetValue(a, b, y.substring(1, 4));
								break;
							case "2":
								lpSetValue(a, b, y.substring(4, 7));
								break;
							case "3":
								lpSetValue(a, b, y.substring(7, 11))
							}
						else
							lpSetValue(a, b, j, true);
						break;
					case "mobilephone23":
					case "evephone23":
					case "phone23":
					case "fax23":
						E = c.substring(0, c.length - 2);
						v = d.phone;
						if ("evephone" == E)
							v = d.evephone;
						if ("fax" == E)
							v = d.fax;
						if ("mobilephone" == E)
							v = d.mobilephone;
						j = lpdec(v);
						if (j.length <= 3)
							j = "";
						y = j.replace(/\D/g, "");
						if (y.length == 10 && y.charAt(0) >= "2" && y.charAt(3) >= "2")
							y = "1" + y;
						if (y.length == 11 && y.charAt(0) == "1" && y.charAt(1) >= "2" && y.charAt(4) >= "2") {
							f = (n <= 0 || n >= 8) && (e <= 0 || e >= 8) ? true : false;
							lpSetValue(a, b, y.substring(4, 7) + (f ? "-" : "") + y.substring(7, 11))
						} else
							lpSetValue(a, b, j, true);
						break;
					case "mobilephone":
					case "evephone":
					case "phone":
					case "fax":
						E = c;
						v = d.phone;
						var $ = typeof d.countryphone != "undefined" ? d.countryphone : typeof d.phone3lcc != "undefined" ? d.phone3lcc : "";
						if ("evephone" == E) {
							v = d.evephone;
							$ = typeof d.countryevephone != "undefined" ? d.countryevephone : typeof d.evephone3lcc != "undefined" ? d.evephone3lcc : ""
						}
						if ("fax" == E) {
							v = d.fax;
							$ = typeof d.countryfaxphone != "undefined" ? d.countryfaxphone : typeof d.fax3lcc != "undefined" ? d.fax3lcc : ""
						}
						if ("mobilephone" == E) {
							v = d.mobilephone;
							$ = typeof d.countrymobphone != "undefined" ? d.countrymobphone : typeof d.mobilephone3lcc != "undefined" ? d.mobilephone3lcc : ""
						}
						j = lpdec(v);
						if (j.length <= 3)
							j = "";
						if (j.length == 11 && j.match(/^\d+$/) && j.charAt(0) == "1" && j.charAt(1) >= "2" && j.charAt(4) >= "2") {
							j = j.substring(1);
							if (e <= 0 || e >= 12)
								j = j.substring(0, 3) + "-" + j.substring(3, 6) + "-" + j.substring(6, 10)
						} else if (j.length >= 2) {
							var da = lpdec($), aa = get_phone_code(da);
							if (aa && j.indexOf(aa) == 0 && j.charAt(aa.length) == "0")
								j = j.substring(aa.length)
						}
						lpSetValue(a, b, j, true);
						break;
					case "mobilephonecc":
					case "evephonecc":
					case "phonecc":
					case "faxcc":
						E = c.substring(0, c.length - 2);
						v = d.phone;
						$ = typeof d.countryphone != "undefined" ? d.countryphone : typeof d.phone3lcc != "undefined" ? d.phone3lcc : "";
						if ("evephone" == E) {
							v = d.evephone;
							$ = typeof d.countryevephone != "undefined" ? d.countryevephone : typeof d.evephone3lcc != "undefined" ? d.evephone3lcc : ""
						}
						if ("fax" == E) {
							v = d.fax;
							$ = typeof d.countryfaxphone != "undefined" ? d.countryfaxphone : typeof d.fax3lcc != "undefined" ? d.fax3lcc : ""
						}
						if ("mobilephone" == E) {
							v = d.mobilephone;
							$ = typeof d.countrymobphone != "undefined" ? d.countrymobphone : typeof d.mobilephone3lcc != "undefined" ? d.mobilephone3lcc : ""
						}
						j = lpdec(v);
						da = lpdec($);
						(aa = get_phone_code(da)) && j.indexOf(aa) == 0 && lpSetValue(a, b, aa, true);
						break;
					case "zip1":
						j = lpdec(d.zip);
						y = j.replace(/\D/g, "");
						if (y.length == 5 || y.length == 9)
							j = y.substring(0, 5);
						else if (g == "ja-JP" && y.length == 7)
							j = y.substring(0, 3);
						else {
							var Y = j.replace(/[^A-Za-z0-9]/g, "");
							if (Y.match(/^(?:[A-Za-z]\d){3}$/))
								j = Y.substring(0, 3);
							else if (Y.match(/^[A-Za-z]{1,2}\d[A-Za-z0-9]?\d[A-Za-z]{2}$/))
								j = Y.substring(0, Y.length - 3);
							else if (Y.length < j.length) {
								w = j.split(/[^A-Za-z0-9]+/);
								j = w[0]
							}
						}
						lpSetValue(a, b, j);
						break;
					case "zip2":
						j = lpdec(d.zip);
						y = j.replace(/\D/g, "");
						f = false;
						if (y.length == 5) {
							j = "";
							f = true
						} else if (y.length == 9)
							j = y.substring(5, 9);
						else if (g == "ja-JP" && y.length == 7)
							j = y.substring(3, 7);
						else {
							Y = j.replace(/[^A-Za-z0-9]/g, "");
							if (Y.match(/^(?:[A-Za-z]\d){3}$/))
								j = Y.substring(3, 6);
							else if (Y.match(/^[A-Za-z]{1,2}\d[A-Za-z0-9]?\d[A-Za-z]{2}$/))
								j = Y.substring(Y.length - 3);
							else if (Y.length < j.length) {
								w = j.split(/[^A-Za-z0-9]+/);
								j = w[1]
							}
						}
						lpSetValue(a, b, j, false, false, f);
						break;
					case "gender":
						j = lpdec(d.gender).toUpperCase();
						if (j != "") {
							p = j;
							if (j == "M")
								p = lpgs("Male", g);
							if (j == "F")
								p = lpgs("Female", g);
							p = p.toUpperCase();
							if (b.type == "select-one")
								for (f = 0; f < b.options.length; f++) {
									var ea = lptrim(b.options[f].text).toUpperCase(), C = lptrim(b.options[f].value).toUpperCase();
									if (C.indexOf(j) == 0 || ea.indexOf(j) == 0 || C.indexOf(p) == 0 || ea.indexOf(p) == 0) {
										b.selectedIndex = f;
										break
									}
								}
							else if (b.type == "radio") {
								C = lptrim(b.value).toUpperCase();
								if (C.indexOf(j) == 0 || C.indexOf(p) == 0)
									b.checked = true;
								else if ((N = b.parentNode) && N.childNodes) {
									for (f = 0; f < N.childNodes.length; f++)
										if (N.childNodes[f] == b)
											break;
									if (f < N.childNodes.length - 1) {
										B = N.childNodes[f + 1];
										var P = lptrim(B.nodeValue).toUpperCase();
										if (B.nodeType == 3 && (P.indexOf(j) == 0 || P.indexOf(p) == 0))
											b.checked = true;
										else if (B.nodeType == 3 && f < N.childNodes.length - 2 || B.nodeType == 1) {
											R = B.nodeType == 1 ? N.childNodes[f + 1] : N.childNodes[f + 2];
											if (R.nodeType == 1 && R.tagName == "LABEL" && R.htmlFor == b.id) {
												G = lpGetText(R, b);
												var Z = lptrim(G).toUpperCase();
												if (Z.indexOf(j) == 0 || Z.indexOf(p) == 0)
													b.checked = true
											} else if (R.nodeType == 1 && R.tagName == "IMG" && typeof R.alt == "string") {
												G = R.alt;
												var V = lptrim(G).toUpperCase();
												if (V.indexOf(j) == 0 || V.indexOf(p) == 0)
													b.checked = true
											}
										}
									}
								}
							} else
								lpSetValue(a, b, j)
						}
						break;
					case "age":
						var X = lpdec(d.birthday);
						if (X != "") {
							var Q = parseInt(X.substring(0, 4)), ja = parseInt(X.substring(5, 7));
							A = parseInt(X.substring(8, 10));
							var ga = new Date, la = ga.getFullYear(), ha = ga.getMonth() + 1, na = ga.getDate();
							j = la - Q;
							if (ha < ja || ha == ja && na < A)
								j--;
							if (b.type == "select-one")
								for (f = 0; f < b.options.length; f++) {
									var ka = b.options[f].text;
									d = a = -1;
									if (z = ka.match(/(\d+)\D+(\d+)/)) {
										a = parseInt(z[1]);
										d = parseInt(z[2])
									} else if (z = ka.match(/^\d+/)) {
										var ia = parseInt(z[0]);
										if (f < b.options.length / 2) {
											a = 0;
											d = ia
										} else {
											a = ia;
											d = 99999
										}
									} else if (z = ka.match(/\d+$/)) {
										ia = parseInt(z[0]);
										if (f < b.options.length / 2) {
											a = 0;
											d = ia - 1
										} else {
											a = ia + 1;
											d = 99999
										}
									}
									if (a != -1 && d != -1 && j >= a && j <= d) {
										b.selectedIndex = f;
										break
									}
								}
							else
								lpSetValue(a, b, j)
						}
						break;
					case "housenumber":
						j = lpdec(d.address1);
						if (typeof d.housenumber != "undefined" && d.housenumber != "")
							j = lpdec(d.housenumber);
					case "housenumbername":
						if (typeof j == "undefined")
							j = typeof d.housenumbername != "undefined" && d.housenumbername != "" ? lpdec(d.housenumbername) : lpdec(d.address1);
						z = j.match(/^\d+/);
						if (!z) {
							j = lpdec(d.address2);
							z = j.match(/^\d+/)
						}
						if (!z) {
							j = lpdec(d.address3);
							z = j.match(/^\d+/)
						}
						if (z) {
							lpSetValue(a, b, z[0]);
							break
						} else if (c == "housenumber")
							break;
					case "housename":
						j = lpdec(d.address1);
						if (typeof d.housename != "undefined" && d.housename != "")
							j = lpdec(d.housename);
						j = j.replace(/^\d+\s*/, "");
						lpSetValue(a, b, j)
					}
				b.value != r && fire_onchange(b)
			}
	} catch (ma) {
		lpReportError("Failure with filling form field: " + ma + " ln: " + ma.lineNumber)
	}
}
function lpGetCCType(a) {
	var b = "UNK";
	if ((a.substring(0, 2) == "34" || a.substring(0, 2) == "37") && a.length == 15)
		b = "AMEX";
	else if ((a.substring(0, 4) == "6011" || a.substring(0, 2) == "65") && a.length == 16)
		b = "DISC";
	else if ((a.substring(0, 2) == "51" || a.substring(0, 2) == "52" || a.substring(0, 2) == "53" || a.substring(0, 2) == "54" || a.substring(0, 2) == "55") && a.length == 16)
		b = "MC";
	else if ((a.substring(0, 6) == "417500" || a.substring(0, 4) == "4917" || a.substring(0, 4) == "4913" || a.substring(0, 4) == "4508" || a.substring(0, 4) == "4844") && a.length == 16)
		b = "ELECTRON";
	else if (a.substring(0, 1) == "4" && a.length == 16)
		b = "VISA";
	else if ((a.substring(0, 4) == "5018" || a.substring(0, 4) == "5020" || a.substring(0, 4) == "5038" || a.substring(0, 4) == "6304" || a.substring(0, 4) == "6759" || a.substring(0, 4) == "6761") && a.length >= 12 && a.length <= 19)
		b = "MAESTRO";
	else if ((a.substring(0, 4) == "6334" || a.substring(0, 4) == "6767") && (a.length == 16 || a.length == 18 || a.length == 19))
		b = "SOLO";
	return b
}
function CCTypeMatch(a, b) {
	a = a.toUpperCase();
	b = b.toUpperCase();
	if (a == "AMEX" && b.indexOf("BANAMEX") != -1)
		return false;
	if (b.indexOf(a) != -1)
		return true;
	else
		switch (a) {
		case "AMEX":
			return b.indexOf("AMERICAN") != -1 || b.indexOf("AMX") != -1 || b == "AX";
		case "DISC":
			return b.indexOf("DIS") != -1 || b == "DI";
		case "MC":
			return b.indexOf("MASTER") != -1;
		case "VISA":
			return b.indexOf("VSA") != -1 || b == "VI";
		default:
			return false
		}
}
function lpSetValue(a, b, c, e, d, g) {
	if (c != "" || g) {
		if (typeof b.maxLength != "undefined" && g_allowtruncate) {
			g = parseInt(b.maxLength);
			if (g > 0 && c.length > g) {
				if (e)
					return;
				c = d ? c.substring(c.length - g) : c.substring(0, g)
			}
		}
		if (a) {
			if (typeof a.formfillfields == "undefined")
				a.formfillfields = [];
			a.formfillfields[getname(b)] = c
		}
		b.value = c
	}
}
var lpgettext_abort = false;
function lpGetText(a, b, c, e) {
	c || (lpgettext_abort = false);
	if (a == b) {
		lpgettext_abort = true;
		return ""
	}
	if (a.nodeType == 3)
		return strip(a.nodeValue).length > 2 ? a.nodeValue : "";
	c = [];
	var d = 0, g = typeof a.tagName == "string" ? a.tagName : "";
	if (a.lp_too_many)
		return "";
	var k = a && a.style && !lpIsVisible(a, true);
	e = false;
	if (g == "LABEL")
		e = true;
	d = 0;
	if (g != "OPTION" && g != "SCRIPT" && g != "TEXTAREA" && !k)
		for (; typeof a.childNodes[d] != "undefined";) {
			c[c.length] = lpGetText(a.childNodes[d], b, true, e);
			if (lpgettext_abort)
				break;
			if (d++ > 50) {
				a.lp_too_many = 1;
				return ""
			}
		}
	a = "|";
	if (typeof e != "undefined" && e)
		a = "";
	return c.join(a)
}
function get_phone_code(a) {
	var b = [];
	b.AND = 376;
	b.ARE = 971;
	b.AFG = 93;
	b.ATG = 1;
	b.AIA = 1;
	b.ALB = 355;
	b.ARM = 374;
	b.ANT = 599;
	b.AGO = 244;
	b.ATA = 672;
	b.ARG = 54;
	b.ASM = 1;
	b.AUT = 43;
	b.AUS = 61;
	b.ABW = 297;
	b.ALA = 358;
	b.AZE = 994;
	b.BIH = 387;
	b.BRB = 1;
	b.BGD = 880;
	b.BEL = 32;
	b.BFA = 226;
	b.BGR = 359;
	b.BHR = 973;
	b.BDI = 257;
	b.BEN = 229;
	b.BLM = 590;
	b.BMU = 1;
	b.BRN = 673;
	b.BOL = 591;
	b.BRA = 55;
	b.BHS = 1;
	b.BTN = 975;
	b.BVT = 47;
	b.BWA = 267;
	b.BLR = 375;
	b.BLZ = 501;
	b.CAN = 1;
	b.CCK = 61;
	b.COD = 243;
	b.CAF = 236;
	b.COG = 242;
	b.CHE = 41;
	b.CIV = 225;
	b.COK = 682;
	b.CHL = 56;
	b.CMR = 237;
	b.CHN = 86;
	b.COL = 57;
	b.CRI = 506;
	b.CUB = 53;
	b.CPV = 238;
	b.CXR = 61;
	b.CYP = 357;
	b.CZE = 420;
	b.DEU = 49;
	b.DJI = 253;
	b.DNK = 45;
	b.DMA = 1;
	b.DOM = 1;
	b.DZA = 213;
	b.ECU = 593;
	b.EST = 372;
	b.EGY = 20;
	b.ESH = 212;
	b.ERI = 291;
	b.ESP = 34;
	b.ETH = 251;
	b.FIN = 358;
	b.FJI = 679;
	b.FLK = 500;
	b.FSM = 691;
	b.FRO = 298;
	b.FRA = 33;
	b.GAB = 241;
	b.GBR = 44;
	b.GRD = 1;
	b.GEO = 995;
	b.GUF = 594;
	b.GGY = 44;
	b.GHA = 233;
	b.GIB = 350;
	b.GRL = 299;
	b.GMB = 220;
	b.GIN = 224;
	b.GLP = 590;
	b.GNQ = 240;
	b.GRC = 30;
	b.SGS = 995;
	b.GTM = 502;
	b.GUM = 1;
	b.GNB = 245;
	b.GUY = 592;
	b.HKG = 852;
	b.HMD = 672;
	b.HND = 504;
	b.HRV = 385;
	b.HTI = 509;
	b.HUN = 36;
	b.ESC = 34;
	b.IDN = 62;
	b.IRL = 353;
	b.ISR = 972;
	b.IMM = 44;
	b.IND = 91;
	b.IOT = 246;
	b.IRQ = 964;
	b.IRN = 98;
	b.ISL = 354;
	b.ITA = 39;
	b.JEY = 44;
	b.JAM = 1;
	b.JOR = 962;
	b.JPN = 81;
	b.KEN = 254;
	b.KGZ = 996;
	b.KHM = 855;
	b.KIR = 686;
	b.COM = 269;
	b.KNA = 1;
	b.PRK = 850;
	b.KOR = 82;
	b.KWT = 965;
	b.CYM = 1;
	b.KAZ = 7;
	b.LAO = 856;
	b.LBN = 961;
	b.LCA = 1;
	b.LIE = 423;
	b.LKA = 94;
	b.LBR = 231;
	b.LSO = 266;
	b.LTU = 370;
	b.LUX = 352;
	b.LVA = 371;
	b.LBY = 218;
	b.MAR = 212;
	b.MCO = 377;
	b.MDA = 373;
	b.MNE = 382;
	b.MAF = 590;
	b.MDG = 261;
	b.MHL = 692;
	b.MKD = 389;
	b.MLI = 223;
	b.MMR = 95;
	b.MNG = 976;
	b.MAC = 853;
	b.MNP = 1;
	b.MTQ = 596;
	b.MRT = 222;
	b.MSR = 1;
	b.MLT = 356;
	b.MUS = 230;
	b.MDV = 960;
	b.MWI = 265;
	b.MEX = 52;
	b.MYS = 60;
	b.MOZ = 258;
	b.NAM = 264;
	b.NCL = 687;
	b.NER = 227;
	b.NFK = 672;
	b.NGA = 234;
	b.NIC = 505;
	b.NLD = 31;
	b.NOR = 47;
	b.NPL = 977;
	b.NRU = 674;
	b.NIU = 683;
	b.NZL = 64;
	b.OMN = 968;
	b.PAN = 507;
	b.PER = 51;
	b.PYF = 689;
	b.PNG = 675;
	b.PHL = 63;
	b.PAK = 92;
	b.POL = 48;
	b.SPM = 508;
	b.PCN = 872;
	b.PRI = 1;
	b.PSE = 970;
	b.PRT = 351;
	b.PLW = 680;
	b.PRY = 595;
	b.QAT = 974;
	b.REU = 262;
	b.ROU = 40;
	b.SRB = 381;
	b.RUS = 7;
	b.RWA = 250;
	b.SAU = 966;
	b.SLB = 677;
	b.SYC = 248;
	b.SDN = 249;
	b.SWE = 46;
	b.SGP = 65;
	b.SHN = 290;
	b.SVN = 386;
	b.SJM = 47;
	b.SVK = 421;
	b.SLE = 232;
	b.SMR = 378;
	b.SEN = 221;
	b.SOM = 252;
	b.SUR = 597;
	b.STP = 239;
	b.SLV = 503;
	b.SYR = 963;
	b.SWZ = 268;
	b.TCA = 1;
	b.TCD = 235;
	b.ATF = 596;
	b.TGO = 228;
	b.THA = 66;
	b.TJK = 992;
	b.TKL = 690;
	b.TLS = 670;
	b.TKM = 993;
	b.TUN = 216;
	b.TON = 676;
	b.TUR = 90;
	b.TTO = 1;
	b.TUV = 688;
	b.TWN = 886;
	b.TZA = 255;
	b.UKR = 380;
	b.UGA = 256;
	b.UMI = 1;
	b.USA = 1;
	b.URY = 598;
	b.UZB = 998;
	b.VAT = 379;
	b.VCT = 1;
	b.VEN = 58;
	b.VGB = 1;
	b.VIR = 1;
	b.VNM = 84;
	b.VUT = 678;
	b.WLF = 681;
	b.WSM = 685;
	b.YEM = 967;
	b.MYT = 262;
	b.YUG = 381;
	b.ZAF = 27;
	b.ZMB = 260;
	b.ZWE = 263;
	return typeof b[a] != "undefined" ? "" + b[a] : null
}
function lpReportError(a) {
	console_log(a)
}
function lpgs(a, b) {
	var c = typeof b == "undefined" || b == null ? "" : b;
	if (typeof lpgscache[c + a] != "undefined")
		return lpgscache[c + a];
	if (typeof lpgslocales[c] == "undefined" && a.indexOf("ff_") == 0) {
		ApplyOverrides(c);
		if (typeof lpgscache[c + a] != "undefined")
			return lpgscache[c + a]
	}
	if (typeof translations != "undefined") {
		if (typeof b != "undefined" && b && typeof translations[b] != "undefined" && typeof translations[b][a] != "undefined")
			return translations[b][a];
		if (typeof translations["en-US"] != "undefined" && typeof translations["en-US"][a] != "undefined")
			return translations["en-US"][a]
	}
	if (typeof lpgscache["en-US" + a] != "undefined")
		return lpgscache["en-US" + a];
	return a
}
function lpdbg() {
}
function lpConfirmYesNo(a) {
	return confirm(a)
}
function lpdec(a) {
	return a
}
function LP_form_fill() {
	LP_to_formfill.customfields = [];
	for ( var a = 0; typeof LP_to_formfill["custom_field" + a] != "undefined"; a++)
		LP_to_formfill.customfields[a] = LP_to_formfill["custom_field" + a];
	lpformfills = Array(LP_to_formfill);
	lpCheckFormFill(null, document, true, false, LP_to_formfill.ffid, 1, window)
}
if (typeof lpgenpassforms == "undefined")
	lpgenpassforms = [];
if (typeof lpgenpasscurrentpwfields == "undefined")
	lpgenpasscurrentpwfields = [];
function get_username_val(a) {
	a = a.getElementById("Email");
	return a != null && a.type == "hidden" && a.name == "Email" ? a.value : ""
}
function lpCheckGeneratePassword(a, b, c, e, d) {
	if (typeof d == "undefined")
		d = 1;
	if (d > 10)
		return null;
	lpdbg("checkgenpw", "START checkonly=" + c);
	var g = typeof LP != "undefined" && typeof LP.getBrowser().getBrowserForDocument == "function" ? LP.getBrowser().getBrowserForDocument(b) : null;
	if (g)
		a = g;
	if (typeof LP != "undefined" && !a)
		return null;
	g = null;
	try {
		if (!c && typeof lp_notification_exists != "undefined" && (lp_notification_exists(a, "autologin") || lp_notification_exists(a, "generate"))) {
			lpdbg("checkgenpw", "aborting since notification already shown");
			return null
		}
		g = b.location.href;
		if (typeof punycode != "undefined" && typeof punycode.URLToASCII != "undefined")
			g = punycode.URLToASCII(g);
		var k = lpParseUri(g), n = lpcanonizeUrl(g, k), o = lp_gettld(k.host, g);
		lpdbg("checkgenpw", "currenturl=" + g);
		if ((typeof lploggedin == "undefined" || lploggedin) && (c || (typeof lpOfferGeneratePasswd == "undefined" || lpOfferGeneratePasswd) && (typeof never_gen == "undefined" || !never_gen(n, o))))
			for ( var f = b.getElementsByTagName("form"), r = 0; r < f.length; r++)
				if (!(typeof r.offsetLeft != "undefined" && r.offsetLeft < 0 || typeof r.offsetTop != "undefined" && r.offsetTop < 0)) {
					var q = lpCountInputFields(f[r]);
					lpdbg("checkgenpw", "checking form#" + r + " numpasswords=" + q.password + " numpasswordsvisible=" + q.passwordvisible + " passwordscontigious=" + q.passwordsContiguous);
					if (2 <= q.password && q.password <= 4 && 2 <= q.passwordvisible && q.passwordvisible <= 4 && q.passwordsContiguous == true) {
						if (!c) {
							var x = typeof LP != "undefined" ? LP.lpgetcurrenturl(a) : document.location.href;
							if (typeof punycode != "undefined" && typeof punycode.URLToASCII != "undefined")
								x = punycode.URLToASCII(x);
							lpdbg("genpw", "Adding url to lpgenpassforms: " + x);
							lpgenpassforms[x] = f[r];
							q = false;
							if (typeof disable_check_form_fill == "undefined" || !disable_check_form_fill)
								q = lpCheckFormFill(a, b, false, true, null, 1, e);
							var j = false, p = lpCheckCurrentPWField(f[r]), u = [];
							if (p) {
								var w = get_username_val(b);
								j = true;
								lpgenpasscurrentpwfields[x] = p;
								var z = typeof k.path == "string" ? k.path.split("/") : [], J = typeof lptlds != "undefined" && typeof lptlds[o] != "undefined" ? lptlds[o] : [], H;
								for (H in J)
									if (!(typeof lpaccts[H] == "undefined" || lpaccts[H].genpw || lpaccts[H].isbookmark))
										if (LPAHasValue(lpaccts[H], 1)) {
											var D = new lpautologininfo;
											D.realmmatch = false;
											D.id = lpaccts[H].id;
											var U = lpParseUri(lpaccts[H].url);
											D.usernamematch = lpaccts[H].unencryptedUsername != "" && lpaccts[H].unencryptedUsername == w;
											D.urlmatch = lpcanonizeUrl(lpaccts[H].url, U) == n ? true : false;
											D.servermatch = U.host == k.host ? true : false;
											D.portmatch = compare_ports(U, k);
											D.serverportmatch = D.servermatch && D.portmatch;
											var W = typeof U.path == "string" ? U.path.split("/") : [], K;
											for (K = 0; K < z.length && K < W.length; K++)
												if (W[K] != z[K])
													break;
											D.pathlevelmatch = K;
											D.url = g;
											D.fieldmatchcount = 0;
											u[u.length] = D
										}
								if (typeof lp_aids_sort_func != "undefined") {
									u.sort(lp_aids_sort_func);
									u = checkurlrules(lpurlrules, u, o, typeof k.path == "string" ? k.path : "", k.host, lpaccts, get_port(k))
								}
							}
							typeof LP != "undefined" && LP.lpshowHelpDlg("genpw");
							lpdbg("checkgenpw", q ? "showing generatepassword AND fillforms" : "showing generatepassword");
							lp_showNotification("GeneratePassword", a, u, "generate", f[r], null, q, j);
							if (q)
								if (a)
									a.contentDocument.ffidindex = -1;
								else
									document.ffidindex = -1
						}
						return f[r]
					}
				}
	} catch (y) {
		lpReportError("Failure with checking generate password: " + y + " ln: " + y.lineNumber, g)
	}
	if (typeof e == "undefined" || e == null)
		e = a.contentWindow;
	if (e && e.frames)
		for (H = 0; H < e.frames.length; H++)
			try {
				if (e.frames[H].document)
					return lpCheckGeneratePassword(a, e.frames[H].document, c, e.frames[H].window, d + 1)
			} catch (I) {
			}
	return null
}
function lpCheckCurrentPWField(a) {
	for ( var b = RegExp(lpgs("ff_currpass_regexp"), "i"), c = 0; c < a.elements.length; c++) {
		var e = a.elements[c];
		if (e.type == "password")
			if (lpIsVisible(e))
				if (b.exec(getname(e)))
					return e;
				else {
					var d = lpGetTextBeforeFormField(e);
					if (d != "" && b.exec(d))
						return e
				}
	}
	return null
}
function lpCountInputFields(a, b) {
	var c = [];
	c.text = c.password = c["select-one"] = c.textarea = c.passwordValues = c.passwordvisible = c.uniquepasswords = 0;
	c.uname = c.pname = c.oname = "";
	for ( var e = a.elements, d = false, g = false, k = [], n = typeof e != "undefined" ? e.length : 0, o = 0; o < n; o++) {
		var f = e[o].type, r = getname(e[o]), q = e[o].value;
		if (f == "password" || f == "text" || f == "select-one" || f == "textarea" || "email" == f)
			c[f]++;
		if (f == "password") {
			b || lpIsVisible(e[o]) && ++c.passwordvisible;
			q != "" && c.passwordValues++;
			if (d)
				g = true;
			d = true;
			lp_in_array(q, k) || (k[k.length] = q)
		} else
			f == "hidden" || e[o].tagName != "INPUT" && e[o].tagName != "SELECT" && e[o].tagName != "TEXTAREA" || (d = false);
		if (("text" == f || "email" == f) && r != "openid_url" && (c.uname == "" || c.pname == ""))
			c.uname = r;
		if (f == "password")
			c.pname = r;
		if (("text" == f || "email" == f) && r == "openid_url")
			c.oname = r
	}
	c.passwordsContiguous = g;
	c.uniquepasswords = k.length;
	return c
}
function setupFocusEvent(a, b, c, e) {
	if (typeof e == "undefined")
		e = 1;
	if (e > 10)
		return null;
	var d = typeof LP != "undefined" ? !LP.isFennec ? LP.getBrowser().selectedTab.linkedBrowser.contentDocument : LP.getBrowser().contentDocument : document;
	if (!(a == d && typeof d.LPlpm_setupFocusHandler != "undefined" && d.LPlpm_setupFocusHandler == true)) {
		if (a == d)
			d.LPlpm_setupFocusHandler = true;
		d = [ "input", "select" ];
		for ( var g = 0; g < d.length; g++)
			for ( var k = a.getElementsByTagName(d[g]), n = 0, o = 0; o < k.length; o++)
				if (!(b && k[o].type != "password"))
					if (k[o].type == "text" || "email" == k[o].type || k[o].type == "password" || k[o].type == "select-one" || k[o].type == "textarea" || k[o].type == "radio") {
						if ("text" == k[o].type || "email" == k[o].type) {
							var f = RegExp(lpgs("ff_search_regexp"), "i");
							if (k[o].name != "" && f.exec(k[o].name))
								continue
						}
						if (n > 20)
							break;
						else
							n++;
						k[o].addEventListener("focus", function(q) {
							typeof LP != "undefined" ? LP.FieldFocus(q) : FieldFocus(q)
						}, false)
					}
		if (typeof c == "undefined" || c == null)
			c = typeof LP != "undefined" ? !LP.isFennec ? LP.getBrowser().selectedTab.linkedBrowser.contentWindow : LP.getBrowser().contentWindow : window;
		if (c && c.frames)
			for (g = 0; g < c.frames.length; g++)
				try {
					c.frames[g].document && setupFocusEvent(c.frames[g].document, b, c.frames[g].window, e + 1)
				} catch (r) {
				}
	}
}
this.FieldFocus = function(a) {
	var b = typeof LP != "undefined" ? LP.getBrowser().selectedTab.linkedBrowser : null;
	if (typeof LP == "undefined" || b) {
		var c = b ? b.contentDocument : document;
		if (!(!c || typeof c.FieldFocusDone != "undefined" && c.FieldFocusDone == true))
			if (typeof c.LPlpUseLastPassLogin != "undefined" && c.LPlpUseLastPassLogin == true)
				if (lploggedin) {
					c.LPlpUseLastPassLogin = false;
					LP.FieldFocus(a)
				} else {
					lp_showNotification("UseLastPassLogin", b, 0, "login", null);
					c.LPlpUseLastPassLogin = false;
					c.LPlpm_setupFocusHandler = false;
					c.FieldFocusDone = false
				}
			else {
				if (lpNotificationsAfterClick)
					lpCheckGenPwAndFF(b, c, false);
				else if (typeof c.LPlpgenerateandfill == "undefined" && typeof c.LPlpfillforms != "undefined")
					lp_showNotification("FillableFormDetected", b, 0, "formfill");
				else if (typeof c.LPlpgenerateandfill != "undefined")
					lp_showNotification("GeneratePassword", b, c.LPlpgenerateAids, "generate", c.LPlpgenerateForm, null, c.LPlpgenerateandfill, c.LPlpfillcurrent);
				else
					return;
				c.FieldFocusDone = true
			}
	}
};
function populategeneratedpassword(a, b, c) {
	if (!lpgenpassforms[a]) {
		var e, d, g;
		if (typeof LP != "undefined") {
			e = LP.getBrowser().selectedTab.linkedBrowser;
			d = e.contentDocument;
			g = null
		} else {
			e = null;
			d = document;
			g = window
		}
		lpgenpassforms[a] = lpCheckGeneratePassword(e, d, true, g)
	}
	if (lpgenpassforms[a]) {
		form = lpgenpassforms[a];
		e = null;
		e = lpgenpasscurrentpwfields[a] ? lpgenpasscurrentpwfields[a] : lpCheckCurrentPWField(form);
		d = false;
		c = a = null;
		for (g = 1; g <= 2; g++) {
			d = false;
			a = c = null;
			var k = -1;
			if (g == 1) {
				if (e)
					for ( var n = 0; n < form.elements.length; n++)
						if (form.elements[n] == e) {
							k = n + 1;
							break
						}
			} else
				k = 0;
			if (k != -1) {
				for (n = k; n < form.elements.length; n++) {
					k = form.elements[n];
					if (k.type == "password") {
						if (!(!d && a && c)) {
							c = a;
							a = k;
							if (d && a && c)
								break
						}
						d = true
					} else
						d = false
				}
				if (a && c)
					break
			}
		}
		if (a && c) {
			if ((c.value != "" || c == e) && a.value == "" && n < form.elements.length - 1)
				for (n = n + 1; n < form.elements.length; n++) {
					k = form.elements[n];
					if (k.type == "password" && k.value == "") {
						c = a;
						a = k;
						break
					} else if (k.type != "hidden")
						break
				}
			a.focus();
			a.value = b;
			fire_onchange(a);
			c.focus();
			c.value = b;
			fire_onchange(c);
			if (typeof LP != "undefined") {
				b = {};
				b.target = a;
				LP.lpfieldchange(b);
				b.target = c;
				LP.lpfieldchange(b)
			}
		} else
			lpReportError("Couldn't find password fields after generating. form:" + form, null)
	} else if (c == "0") {
		lpReportError("Could not find lpgenpassforms when generating pw", null);
		lpdbg("error", "url " + a + " is not in lpgenpassforms[]")
	}
}
function LP_InputClickToSubmit(a, b, c) {
	for ( var e = a.getElementsByTagName("input"), d = 0, g = 0; g < e.length; g++)
		if (e[g].form == b)
			if ("password" == e[g].type && e[g].value != "")
				d = 1;
			else if (c == e[g].type)
				if (d && c != "button") {
					e[g].click();
					return 1
				}
	if ("button" == c) {
		c = null;
		e = a.getElementsByTagName("button");
		for (g = 0; g < e.length; g++)
			if (e[g].form == b)
				if ("button" == e[g].type || "submit" == e[g].type || "image" == e[g].type)
					if (d)
						if (c) {
							if ("submit" == e[g].type)
								c = e[g]
						} else
							c = e[g];
		if (c) {
			c.click();
			return 1
		}
	}
	return 0
}
this.LPJSON = {};
if (typeof ischrome == "undefined") {
	this.JSON = this.LPJSON;
	if (typeof JSON == "undefined")
		var JSON = this.JSON, LPJSON = this.LPJSON
}
(function() {
	function a(f) {
		return f < 10 ? "0" + f : f
	}
	function b(f) {
		d.lastIndex = 0;
		return d.test(f) ? '"' + f.replace(d, function(r) {
			var q = n[r];
			return typeof q === "string" ? q : "\\u" + ("0000" + r.charCodeAt(0).toString(16)).slice(-4)
		}) + '"' : '"' + f + '"'
	}
	function c(f, r) {
		var q, x, j, p, u = g, w, z = r[f];
		if (z && typeof z === "object" && typeof z.toJSON === "function")
			z = z.toJSON(f);
		if (typeof o === "function")
			z = o.call(r, f, z);
		switch (typeof z) {
		case "string":
			return b(z);
		case "number":
			return isFinite(z) ? String(z) : "null";
		case "boolean":
		case "null":
			return String(z);
		case "object":
			if (!z)
				return "null";
			g += k;
			w = [];
			if (o && typeof o === "object") {
				p = o.length;
				for (q = 0; q < p; q += 1) {
					x = o[q];
					if (typeof x === "string")
						if (j = c(x, z))
							w.push(b(x) + (g ? ": " : ":") + j)
				}
			} else
				for (x in z)
					if (Object.hasOwnProperty.call(z, x))
						if (j = c(x, z))
							w.push(b(x) + (g ? ": " : ":") + j);
			j = w.length === 0 ? "{}" : g ? "{\n" + g + w.join(",\n" + g) + "\n" + u + "}" : "{" + w.join(",") + "}";
			g = u;
			return j
		}
	}
	if (typeof ischrome != "undefined" && typeof Date.prototype.toJSON !== "function") {
		Date.prototype.toJSON = function() {
			return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + a(this.getUTCMonth() + 1) + "-" + a(this.getUTCDate()) + "T" + a(this.getUTCHours()) + ":" + a(this.getUTCMinutes()) + ":" + a(this.getUTCSeconds()) + "Z" : null
		};
		String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
			return this.valueOf()
		}
	}
	var e = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, d = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, g, k, n = {
	"\u0008" : "\\b",
	"\t" : "\\t",
	"\n" : "\\n",
	"\u000c" : "\\f",
	"\r" : "\\r",
	'"' : '\\"',
	"\\" : "\\\\"
	}, o;
	if (typeof LPJSON.stringify !== "function")
		LPJSON.stringify = function(f, r, q) {
			var x;
			k = g = "";
			if (typeof q === "number")
				for (x = 0; x < q; x += 1)
					k += " ";
			else if (typeof q === "string")
				k = q;
			if ((o = r) && typeof r !== "function" && (typeof r !== "object" || typeof r.length !== "number"))
				throw Error("JSON.stringify");
			return c("", {
				"" : f
			})
		};
	if (typeof LPJSON.parse !== "function")
		LPJSON.parse = function(f, r) {
			function q(j, p) {
				var u, w, z = j[p];
				if (z && typeof z === "object")
					for (u in z)
						if (Object.hasOwnProperty.call(z, u)) {
							w = q(z, u);
							if (w !== undefined)
								z[u] = w;
							else
								delete z[u]
						}
				return r.call(j, p, z)
			}
			if (typeof g_ischrome != "undefined" && g_ischrome)
				return JSON.parse(f, r);
			var x;
			e.lastIndex = 0;
			if (e.test(f))
				f = f.replace(e, function(j) {
					return "\\u" + ("0000" + j.charCodeAt(0).toString(16)).slice(-4)
				});
			if (/^[\],:{}\s]*$/.test(f.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
				x = eval("(" + f + ")");
				return typeof r === "function" ? q({
					"" : x
				}, "") : x
			}
			throw new SyntaxError("JSON.parse");
		}
})();
function addStyle() {
	var a = document.createElement("style");
	a.type = "text/css";
	var b = document.createTextNode(" #lastpass-notification { height: 13px;padding: 7px 10px !important;text-align: left;position: relative;font-weight:bold;font-family:Helvetica Neue,Helvetica,Arial,Sans-serif;font-size: 11px;z-index: 1000000099;color: black;vertical-align: top; float: none;} #lastpass-content {display: inline;  padding-left: 5px;vertical-align: top;text-align: left; " + (g_isopera ? "float: left; min-width: 0px;" : "float: none; width: 100%;" + g_webkit_selectable) + " font-family: Helvetica Neue,Helvetica,Arial,sans-serif;font-size: 11px;} .lppopup {position: absolute;-webkit-border-radius: 0px 0px 5px 5px;border-radius: 0px 0px 5px 5px;-webkit-box-shadow: 2px 3px 10px 2px #a6a6a6;box-shadow: 2px 3px 10px 2px #a6a6a6;z-index: 99999;background: #fff;overflow: auto;x: 0px;y: 0px;width: 300px;height: 200px;display: none;} .lppopup table {float:none; display:table; margin: 0px; padding: 0px; border-spacing: 1px;} .lppopup tr:hover {background: -webkit-linear-gradient(top, rgba(214,249,255,1) 0%,rgba(158,232,250,1) 100%);background: -o-linear-gradient(top, rgba(214,249,255,1) 0%,rgba(158,232,250,1) 100%);} .lppopup tr {" + g_webkit_selectable + "background-color: #fff; height: 22px;} .lppopup td {" + g_webkit_selectable + "font-size: 11px;font-family: Helvetica Neue,Helvetica,Arial,sans-serif;color: black;cursor: hand;} .lppopupextended {position: absolute;-webkit-border-radius: 0px 0px 5px 5px;border-radius: 0px 0px 5px 5px;-webkit-box-shadow: 2px 3px 10px 2px #a6a6a6;box-shadow: 2px 3px 10px 2px #a6a6a6;z-index: 99999;background: #fff;x: 0px;y: 0px;width: 400px;height: 200px;display: none; overflow-x:hidden;} .lppopupextended table {float:none; display:table; margin: 0px; padding: 0px; border-spacing: 1px; overflow-x:hidden;} .lppopupextended tr {" + g_webkit_selectable + "background-color: #fff; height: 22px; overflow-x:hidden;} .lppopupextended td {" + g_webkit_selectable + "font-size: 11px;font-family: Helvetica Neue,Helvetica,Arial,sans-serif;color: black;cursor: hand; white-space:nowrap; overflow-x:hidden; } .lppopupextended th {" + g_webkit_selectable + "font-size: 11px;font-family: Helvetica Neue,Helvetica,Arial,sans-serif;color: black;background-color: #ececec;cursor: hand; height: 16px;} .sortable tr:hover {background: -webkit-linear-gradient(top, rgba(214,249,255,1) 0%,rgba(158,232,250,1) 100%);background: -o-linear-gradient(top, rgba(214,249,255,1) 0%,rgba(158,232,250,1) 100%);} .lpopupsearchbox {" + g_webkit_selectable + "background-color: #fff; height: 22px;} .lpopupsearchbox:hover {" + g_webkit_selectable + 'background-color: #fff; height: 22px;} .lpbutton,#lastpass-notification button[type="button"] {background-color: #eeeeee;background-image: -webkit-gradient(linear, left top, left bottom, from(#eeeeee), to(#cccccc));background-image: -webkit-linear-gradient(top, #eeeeee, #cccccc);background-image: -o-linear-gradient(top, #eeeeee, #cccccc);background-image: linear-gradient(top, #eeeeee, #cccccc);border: 1px solid #ccc;border-bottom: 1px solid #bbb;-webkit-border-radius: 3px;border-radius: 3px;color: #333;line-height: 1;font-weight:bold;text-align: center;text-shadow: 0 1px 0 #eee;width: auto;float: right; margin: -2px 5px 2px 2px; height:17px;padding:1px 6px !important;} .lpbutton:hover,#lastpass-notification button[type="button"]:hover {background-color: #dddddd; background-image: -webkit-gradient(linear, left top, left bottom, from(#dddddd), to(#bbbbbb)); background-image: -webkit-linear-gradient(top, #dddddd, #bbbbbb);-o-linear-gradient(top, #dddddd, #bbbbbb); border: 1px solid #bbb; border-bottom: 1px solid #999; cursor: pointer; text-shadow: 0 1px 0 #ddd;} #lastpass-notification img {margin: 0px 0px 0px 0px;padding: 0px 0px 3px 0px;} ');
	a.appendChild(b);
	document.head ? document.head.appendChild(a) : document.body.appendChild(a)
}
function get_notification_bg() {
	return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAJYCAYAAABIPDecAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAIpJREFUWEftzcEKwjAQhOEIfUHfzJNHX07wYKuHkiDYbGJJMhZS8Ozh39PHzLI7nM6X2a0zeB9cwfR8VIzj/VAQQqtijDUxMyGqsgrTTtyqqGrpkj3Wy987XZJ00FJqSVKlJOfcwbXZMN2uRyUmLMJL8MIshN3OWyjvfz0FAAAAAAAAAAAAAAD8DT79ZmFeaJNdcgAAAABJRU5ErkJggg==')"
}
function get_notification_add_bg() {
	return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAJYCAYAAABIPDecAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAALJJREFUWIXtzrttQ0EMRNG7AKt1G2pBLbgF9+BG7ECBoAcYFrxLjoIVIzXgYBgdEPxMnD++JSCO3wSJuB4TBsTlmIwxiPs9gUFUgihiVe2OBCAiMwGIaqgmEkStv32n1uyt1cNzI9fzKdV3tHaeXJMBBEokEVW5n6pqD6PuZCIgGDAkgh2REOwYn+9vp70Fs/HTuDUuja+Xzu1la99R/+JZhmEYhmEYhmEYhmEYhmH8QzwALjFuWzeeKlAAAAAASUVORK5CYII=')"
}
function get_notification_error_bg() {
	return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAJYCAYAAABIPDecAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAINJREFUWMPtz0EKAjEMheEIBW/h+byKF/QSLtSKzCBOok58HWTo3sWf1cdLSpNy3O7c3lXGCJtxsylxdU9UJQ/LKpPFZobHkiRcM75OwlYz7bn3Wg0R0W31kwbTPoeo+2+Sh30wCnfhIpyEs1CFQXj+bmjLpwAAAAAAAAAAAAAAgH/DC5OFQV7fXlzwAAAAAElFTkSuQmCC')"
}
function showMenuScript() {
	return "function lpshowmenudiv(id){   closelpmenus(id);   var div = document.getElementById('lppopup'+id);   var btn = document.getElementById('lp'+id);   if(btn && div){     var btnstyle = window.getComputedStyle(btn, null);     var divstyle = window.getComputedStyle(div, null);     var posx = btn.offsetLeft;     posx -= 80;     var divwidth = parseInt(divstyle.getPropertyValue('width'));     if(posx + divwidth > window.innerWidth - 25){       posx -= ((posx + divwidth) - window.innerWidth + 25);     }     div.style.left = posx + \"px\";     div.style.top = (btn.offsetTop + btnstyle.getPropertyValue('height')) + \"px\";         if(div.style.display=='block'){div.style.display = 'none'; if(typeof(slideup)=='function'){slideup();} }    else div.style.display = 'block';       } }function closelpmenus(id){   if(typeof(lpgblmenus)!='undefined'){     for(var i=0; i < lpgblmenus.length; i++){       if((id==null || lpgblmenus[i]!='lppopup'+id) && document.getElementById(lpgblmenus[i]))         document.getElementById(lpgblmenus[i]).style.display = 'none';     }   }} var lpcustomEvent = document.createEvent('Event'); lpcustomEvent.initEvent('lpCustomEventMenu', true, true); "
}
function showExtTableScript() {
	return "function lpshowmenudiv(id){   closelpmenus(id);   var div = document.getElementById('lppopup'+id);   var btn = document.getElementById('lp'+id);   if(btn && div){     var btnstyle = window.getComputedStyle(btn, null);     var divstyle = window.getComputedStyle(div, null);     var posx = btn.offsetLeft;     posx -= 80;     var divwidth = parseInt(divstyle.getPropertyValue('width'));     if(posx + divwidth > window.innerWidth - 25){       posx -= ((posx + divwidth) - window.innerWidth + 25);     }     div.style.left = posx + \"px\";     div.style.top = (btn.offsetTop + btnstyle.getPropertyValue('height')) + \"px\";         if(div.style.display=='block'){div.style.display = 'none'; if(typeof(slideup)=='function'){slideup();} }    else div.style.display = 'block';     if(id == 'autofill' || id == 'autologin') {       var box = document.getElementById(id+'tabsearchbox');       if (box != null && (typeof(box.focus) != 'undefined')) { box.focus(); }     }   } }function closelpmenus(id){   if(typeof(lpgblmenus)!='undefined'){     for(var i=0; i < lpgblmenus.length; i++){       if((id==null || lpgblmenus[i]!='lppopup'+id) && document.getElementById(lpgblmenus[i]))         document.getElementById(lpgblmenus[i]).style.display = 'none';     }   }} function chk_should_close_exttable(event) {   var dont_close_on_me=[       'autologintab', 'autologintabfooter', 'autologintabheader', 'autologintabsearchlabel',       'autofilltab', 'autofilltabfooter', 'autofilltabheader', 'autofilltabsearchlabel',       'fillformtab', 'fillformtabfooter', 'fillformtabheader', 'fillformtabsearchlabel',       'sorttable_sortrevind', 'sorttable_sortfwdind'];   var tid=null;   var ptid=null;   if (typeof(event.target) != 'undefined') {     tid=event.target.id;     if (typeof(event.target.parentElement) != 'undefined' && event.target.parentElement != null) {       ptid=event.target.parentElement.id;     }   }   var foundit=false;   for (var x in dont_close_on_me) {     if ((tid != null) && (tid == dont_close_on_me[x])) {       foundit=true;       break;     }     if ((ptid != null) && (ptid == dont_close_on_me[x])) {       foundit=true;       break;     }   }   return !foundit; } var lpcustomEvent = document.createEvent('Event'); lpcustomEvent.initEvent('lpCustomEventMenu', true, true); "
}
function run_custom_js(a, b) {
	try {
		if (b != "")
			if (!(lp_gettld_url(a.location.href) == "facebook.com" && a.getElementsByTagName("form").length == 0)) {
				b = b.replace(/lpcurrpage./g, "");
				b = "try{" + b + "}catch(e){}";
				var c = a.createElement("script"), e = a.createTextNode(b);
				c.appendChild(e);
				a.body && a.body.appendChild(c)
			}
	} catch (d) {
	}
}
function lpPrepareCustomJS(a, b, c, e, d, g) {
	if (e == "3") {
		if (a.indexOf("lpcurruser") != -1) {
			if (!g.getElementById("lpcurruserelt"))
				if (g.body) {
					var k = g.createElement("input");
					k.setAttribute("style", "display: none;");
					k.setAttribute("type", "text");
					k.setAttribute("id", "lpcurruserelt");
					k.setAttribute("value", "");
					g.body.appendChild(k)
				}
			if (g.getElementById("lpcurruserelt"))
				g.getElementById("lpcurruserelt").value = b
		}
		if (a.indexOf("lpcurrpass") != -1) {
			if (!g.getElementById("lpcurrpasselt"))
				if (g.body) {
					b = g.createElement("input");
					b.setAttribute("style", "display: none;");
					b.setAttribute("type", "password");
					b.setAttribute("id", "lpcurrpasselt");
					b.setAttribute("value", "");
					g.body.appendChild(b)
				}
			if (g.getElementById("lpcurrpasselt"))
				g.getElementById("lpcurrpasselt").value = c
		}
	}
	a = "if (typeof(lpcurruser) == 'undefined') lpcurruser = ''; if (document.getElementById('lpcurruserelt') && document.getElementById('lpcurruserelt').value != '') { lpcurruser = document.getElementById('lpcurruserelt').value; document.getElementById('lpcurruserelt').value = ''; } if (typeof(lpcurrpass) == 'undefined') lpcurrpass=''; if (document.getElementById('lpcurrpasselt') && document.getElementById('lpcurrpasselt').value != '') { lpcurrpass = document.getElementById('lpcurrpasselt').value; document.getElementById('lpcurrpasselt').value = ''; } var lploc=" + es(e) + ";" + (d == 1 ? "var lponlyfill=1;" : "var lponlyfill=null;") + a + "lpcurruser = ''; lpcurrpass = '';";
	a = a.replace(/lpcurrpage\./g, "");
	a = a.replace(/lpframe1\./g, "");
	a = a.replace(/lpframe2\./g, "");
	return a = a.replace(/lpframe3\./g, "")
};
