#pragma checksum "C:\Users\Ky3mu40FF\Documents\GeoKvantRating\GeoKvantRating\GeoKvantRating\Views\Home\Index.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "a6159de69729b3c8c6b45890b7f5d508e3efd066"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Home_Index), @"mvc.1.0.view", @"/Views/Home/Index.cshtml")]
[assembly:global::Microsoft.AspNetCore.Mvc.Razor.Compilation.RazorViewAttribute(@"/Views/Home/Index.cshtml", typeof(AspNetCore.Views_Home_Index))]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#line 1 "C:\Users\Ky3mu40FF\Documents\GeoKvantRating\GeoKvantRating\GeoKvantRating\Views\_ViewImports.cshtml"
using GeoKvantRating;

#line default
#line hidden
#line 2 "C:\Users\Ky3mu40FF\Documents\GeoKvantRating\GeoKvantRating\GeoKvantRating\Views\_ViewImports.cshtml"
using GeoKvantRating.Models;

#line default
#line hidden
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"a6159de69729b3c8c6b45890b7f5d508e3efd066", @"/Views/Home/Index.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"49352821cc39f14e7cc0fa88c2ddbad2aa3c17fe", @"/Views/_ViewImports.cshtml")]
    public class Views_Home_Index : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
#line 1 "C:\Users\Ky3mu40FF\Documents\GeoKvantRating\GeoKvantRating\GeoKvantRating\Views\Home\Index.cshtml"
  
    ViewData["Title"] = "Home Page";

#line default
#line hidden
            BeginContext(42, 1823, true);
            WriteLiteral(@"
<div id=""container"">
    <div id=""sidebar"">
        <div class=""sidebar-wrapper"">
            <div class=""panel panel-default"" id=""features"">
                <div class=""panel-heading"" id=""sidebar-panel-heading"">
                    <h3 class=""panel-title"">
                        Геоквантумы
                        <button type=""button"" class=""btn btn-xs btn-default pull-right"" id=""sidebar-hide-btn""><i class=""fa fa-chevron-left""></i></button>
                    </h3>
                </div>
                <div class=""panel-body"" id=""sidebar-panel-body"">
                    <div class=""row"">
                        <div class=""col-xs-8 col-md-8"">
                            <input type=""text"" class=""form-control search"" placeholder=""Filter"" />
                        </div>
                        <div class=""col-xs-4 col-md-4"">
                            <button type=""button"" class=""btn btn-primary pull-right sort"" data-sort=""feature-name"" id=""sort-btn""><i class=""fa fa-sort""></i>&nbsp;&nbsp;Sort</button>
");
            WriteLiteral(@"                        </div>
                    </div>
                </div>
                <div class=""sidebar-table"">
                    <table class=""table table-hover"" id=""feature-list"">
                        <thead class=""hidden"">
                            <tr>
                                <th>Icon</th>
                            <tr>
                            <tr>
                                <th>Name</th>
                            <tr>
                            <tr>
                                <th>Chevron</th>
                            <tr>
                        </thead>
                        <tbody class=""list""></tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div id=""mapid""></div>
</div>");
            EndContext();
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<dynamic> Html { get; private set; }
    }
}
#pragma warning restore 1591
