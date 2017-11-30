#!/usr/bin/perl
open(ARTICLES1, "articles1.txt");
while (<ARTICLES1>) # like while($_ = <ARTICLES1>)
{
  print; # like print($_);
}
close (ARTICLES1);
