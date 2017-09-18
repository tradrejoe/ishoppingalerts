using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text.RegularExpressions;


namespace uxlcorp
{
    public partial class iShoppingAlerts : System.Web.UI.Page
    {
        public const Int64 IMEDALERT_INTERVAL = (Int64)(60 * 60 * .73); //2628
        Boolean bShowForm = false;

        public Boolean ShowForm
        {
            get { return bShowForm; }
            set { this.bShowForm = value; }
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            Int64 ts, tshash = 0, tmpDiv, tmpMod, tmphash = 0;
            Int64.TryParse(Request.Params["ts"] + "", out ts);
            Int64.TryParse(Request.Params["tshash"] + "", out tshash);
            tmpDiv = ts / IMEDALERT_INTERVAL;
            tmpMod = ts % IMEDALERT_INTERVAL;
            Regex r = new Regex(@"(\d.\d*)E(\d*)");
            Match m = null;
            try { m = r.Match(Request.Params["tshash"] + ""); }
            catch (Exception) { }
            if (m != null && m.Groups.Count >= 2)
            {
                try
                {
                    Int64 tmpexp = 0;
                    Int64.TryParse(Request.Params["tshash"].Substring(Request.Params["tshash"].IndexOf("E") + 1), out tmpexp);
                    tmphash = Convert.ToInt64(Double.Parse(m.Groups[1].Value) * Math.Pow(10, Double.Parse(m.Groups[2].Value)));

                }
                catch (Exception) { }
            }
            else
            {
                tmphash = tshash;
            }
            ShowForm = ts != 0 && tmphash != 0 && Math.Abs((tmpDiv + tmpMod) - tmphash) < 10;
            //ShowForm = Request.Params["HTTPS"].ToLower().Equals("on");
            //ShowForm = true;
        }
    }
}