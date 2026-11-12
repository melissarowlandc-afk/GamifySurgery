// Local renderer for this batch's original simple SVG diagrams. No network/dependencies.
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Globalization;
using System.Xml;
class RenderSvg {
  static float N(XmlElement e,string k) { var value=e.GetAttribute(k);return value.Length==0?0:float.Parse(value,CultureInfo.InvariantCulture); }
  static Color C(XmlElement e,string k) { return ColorTranslator.FromHtml(e.GetAttribute(k)); }
  static void Main(string[] args) {
    if(args.Length!=2) throw new ArgumentException("Expected source.svg output.png");
    var doc=new XmlDocument();doc.XmlResolver=null;
    var settings=new XmlReaderSettings { DtdProcessing=DtdProcessing.Prohibit,XmlResolver=null };
    using(var reader=XmlReader.Create(args[0],settings)) doc.Load(reader);
    var root=doc.DocumentElement;
    using(var bmp=new Bitmap((int)N(root,"width"),(int)N(root,"height")))
    using(var g=Graphics.FromImage(bmp)) {
      g.Clear(Color.White);g.SmoothingMode=SmoothingMode.AntiAlias;
      g.TextRenderingHint=System.Drawing.Text.TextRenderingHint.AntiAliasGridFit;
      foreach(XmlNode node in root.ChildNodes) {
        var e=node as XmlElement;if(e==null) continue;
        if(e.LocalName=="line") using(var pen=new Pen(C(e,"stroke"),N(e,"stroke-width")))
          g.DrawLine(pen,N(e,"x1"),N(e,"y1"),N(e,"x2"),N(e,"y2"));
        else if(e.LocalName=="rect") {
          using(var brush=new SolidBrush(C(e,"fill"))) g.FillRectangle(brush,N(e,"x"),N(e,"y"),N(e,"width"),N(e,"height"));
          if(e.HasAttribute("stroke")) using(var pen=new Pen(C(e,"stroke"),N(e,"stroke-width")))
            g.DrawRectangle(pen,N(e,"x"),N(e,"y"),N(e,"width"),N(e,"height"));
        } else if(e.LocalName=="ellipse") {
          float x=N(e,"cx")-N(e,"rx"),y=N(e,"cy")-N(e,"ry"),w=2*N(e,"rx"),h=2*N(e,"ry");
          using(var brush=new SolidBrush(C(e,"fill"))) g.FillEllipse(brush,x,y,w,h);
          using(var pen=new Pen(C(e,"stroke"),N(e,"stroke-width"))) g.DrawEllipse(pen,x,y,w,h);
        } else if(e.LocalName=="text") {
          float size=N(e,"font-size");
          using(var font=new Font("Arial",size,e.GetAttribute("font-weight")=="bold"?FontStyle.Bold:FontStyle.Regular,GraphicsUnit.Pixel))
          using(var brush=new SolidBrush(C(e,"fill"))) g.DrawString(e.InnerText,font,brush,N(e,"x"),N(e,"y")-size);
        } else throw new InvalidOperationException("Unsupported original shape "+e.LocalName);
      }
      bmp.Save(args[1],ImageFormat.Png);
    }
  }
}
