
/*
*  GRID PAGE
*
* */

gridPage = new Page();

gridPage.mixerAlignedGrid = false;
gridPage.canScrollTracksUp = false;
gridPage.canScrollTracksDown = false;
gridPage.canScrollScenesUp = false;
gridPage.canScrollScenesDown = false;
gridPage.title = "Clip Launcher";

gridPage.updateOutputState = function()
{
   clear();

   this.canScrollUp = this.mixerAlignedGrid ? this.canScrollScenesUp : this.canScrollTracksUp;
   this.canScrollDown = this.mixerAlignedGrid ? this.canScrollScenesDown : this.canScrollTracksDown;
   this.canScrollLeft = !this.mixerAlignedGrid ? this.canScrollScenesUp : this.canScrollTracksUp;
   this.canScrollRight = !this.mixerAlignedGrid ? this.canScrollScenesDown : this.canScrollTracksDown;

   this.updateScrollButtons();
   this.updateGrid();

   setTopLED(4,
      TEMPMODE == TempMode.SCENE
         ? Colour.GREEN_FULL
         : (TEMPMODE == TempMode.OFF
         ? Colour.YELLOW_FULL
         : Colour.OFF));

   setTopLED(7, this.mixerAlignedGrid ? Colour.RED_FULL : Colour.RED_LOW);
};

gridPage.onShift = function(isPressed)
{
   if (isPressed)
   {
      this.mixerAlignedGrid = !this.mixerAlignedGrid;
      launcherOrientationMode.set(this.mixerAlignedGrid ? "Mixer" : "Arranger");
      host.showPopupNotification("Orientation: " + (this.mixerAlignedGrid ? "Mixer" : "Arranger"));
   }
};

gridPage.onSceneButton = function(row, isPressed)
{
   if (isPressed)
   {
      switch(row)
      {
         case MixerButton.VOLUME:
            this.setTempMode(TempMode.VOLUME);
            break;

         case MixerButton.PAN:
            this.setTempMode(TempMode.PAN);
            break;

         case MixerButton.SEND_A:
            this.setTempMode(TempMode.SEND_A);
            break;

         case MixerButton.SEND_B:
            this.setTempMode(TempMode.SEND_B);
            break;

         case MixerButton.STOP:
            this.setTempMode(TempMode.USER1);
            break;

         case MixerButton.TRK_ON:
            this.setTempMode(TempMode.USER2);
            break;

         case MixerButton.SOLO:
            this.setTempMode(TempMode.USER3);
            break;

         case MixerButton.ARM:
            this.setTempMode(TempMode.TRACK);
            break;
      }
   }
   else
   {
      this.setTempMode(TempMode.OFF);
   }
};

gridPage.onLeft = function(isPressed)
{
   if (isPressed)
   {
      if (this.mixerAlignedGrid) trackBank.scrollTracksUp();
      else trackBank.scrollScenesUp();
   }
};

gridPage.onRight = function(isPressed)
{
   if (isPressed)
   {
      if (this.mixerAlignedGrid) trackBank.scrollTracksDown();
      else trackBank.scrollScenesDown();
   }
};

gridPage.onUp = function(isPressed)
{
   if (isPressed)
   {
      if (this.mixerAlignedGrid) trackBank.scrollScenesUp();
      else trackBank.scrollTracksUp();
   }
};

gridPage.onDown = function(isPressed)
{
   if (isPressed)
   {
      if (this.mixerAlignedGrid) trackBank.scrollScenesDown();
      else trackBank.scrollTracksDown();
   }
};

gridPage.onGridButton = function(row, column, pressed)
{
   if (!pressed) return;

   if (TEMPMODE === TempMode.SCENE)
   {
      trackBank.launchScene(this.mixerAlignedGrid ? row : column);
   }
   else if (TEMPMODE === TempMode.OFF)
   {
      var track = this.mixerAlignedGrid ? column : row;
      var scene = this.mixerAlignedGrid ? row : column;

      if (IS_RECORD_PRESSED)
      {
         trackBank.getTrack(track).getClipLauncher().record(scene);
      }
      else if (IS_EDIT_PRESSED)
      {
         trackBank.getTrack(track).getClipLauncher().showInEditor(scene);
      }
      else
      {
         trackBank.getTrack(track).getClipLauncher().launch(scene);
      }
   }
   else if (TEMPMODE === TempMode.TRACK)
   {
      var track = this.mixerAlignedGrid ? column : row;
      var scene = this.mixerAlignedGrid ? row-2 : column;
      if (this.mixerAlignedGrid == false) {

        switch(scene)
        {
          case TrackModeColumn.STOP:
              trackBank.getTrack(track).getClipLauncher().stop();
              break;

          case TrackModeColumn.SELECT:
              trackBank.getTrack(track).select();
              break;

          case TrackModeColumn.MUTE:
              trackBank.getTrack(track).getMute().toggle();
              break;

          case TrackModeColumn.SOLO:
              trackBank.getTrack(track).getSolo().toggle();
              break;

          case TrackModeColumn.ARM:
              trackBank.getTrack(track).getArm().toggle();
              break;

          case TrackModeColumn.RETURN_TO_ARRANGEMENT:
              trackBank.getTrack(track).getClipLauncher().returnToArrangement();
              break;
        }

      } else {

        switch(scene)
		  {
		  	 case TrackModeColumn.RETURN_TO_ARRANGEMENT-9:
				trackBank.getTrack(track).getClipLauncher().returnToArrangement();
				break;

			 case TrackModeColumn.SELECT:
				trackBank.getTrack(track).select();
				break;

			 case TrackModeColumn.ARM:
				trackBank.getTrack(track).getArm().toggle();
				break;

			 case TrackModeColumn.SOLO:
				trackBank.getTrack(track).getSolo().toggle();
				break;

			 case TrackModeColumn.MUTE:
				trackBank.getTrack(track).getMute().toggle();
				break;

			 case TrackModeColumn.STOP+5:
				trackBank.getTrack(track).getClipLauncher().stop();
				break;

		  }

      }
   }
   else
   {
      var track = this.mixerAlignedGrid ? column : row;
      var value = this.mixerAlignedGrid ? -Math.abs(row)+7 : column;

      switch(TEMPMODE) {

         case TempMode.VOLUME:
            trackBank.getTrack(track).getVolume().set(value, 8);
            break;

         case TempMode.PAN:
            trackBank.getTrack(track).getPan().set(value, 8);
            break;

         case TempMode.SEND_A:
            trackBank.getTrack(track).getSend(0).set(value, 8);
            break;

         case TempMode.SEND_B:
            trackBank.getTrack(track).getSend(1).set(value, 8);
            break;
      }
   }
};

gridPage.updateGrid = function()
{
   for(var t=0; t<8; t++)
   {
      this.updateTrackValue(t);
      this.updateVuMeter(t);
   }
};

function vuLevelColor(level)
{
   switch (level)
   {
      case 1:
         return mixColour(0, 1, false);

      case 2:
         return mixColour(0, 2, false);

      case 3:
         return mixColour(0, 3, false);

      case 4:
         return mixColour(2, 3, false);

      case 5:
         return mixColour(3, 3, false);

      case 6:
         return mixColour(3, 2, false);

      case 7:
         return mixColour(3, 0, false);
   }

   return Colour.OFF;
}

gridPage.updateVuMeter = function(track)
{
   var val = vuMeter[track];
   var colour = Colour.OFF;

   if (this.mixerAlignedGrid)
   {
      var i = 7 - track;
      colour = masterVuMeter > i ? vuLevelColor(Math.max(1, i)) : Colour.OFF;
   }
   else
   {
      colour = vuLevelColor(val);
   }

   switch(TEMPMODE)
   {
      case TempMode.VOLUME:
         if (track === 0) colour = Colour.GREEN_FULL;
         break;

      case TempMode.PAN:
         if (track === 1) colour = Colour.AMBER_FULL;
         break;

      case TempMode.SEND_A:
         if (track === 2) colour = Colour.GREEN_FULL;
         break;

      case TempMode.SEND_B:
         if (track === 3) colour = Colour.GREEN_FULL;
         break;

      case TempMode.TRACK:
         if (track === 7) colour = Colour.YELLOW_FULL;
         break;
   }

   setRightLED(track, colour);
};

gridPage.updateTrackValue = function(track)
{
   if (activePage != gridPage) return;

   if (TEMPMODE == TempMode.OFF || TEMPMODE == TempMode.SCENE)
   {
      for(var scene=0; scene<8; scene++)
      {
         var i = track + scene*8;

         var col = arm[track] ? Colour.RED_LOW : Colour.OFF;

         var fullval = mute[track] ? 1 : 3;

         if (hasContent[i] > 0)
         {
            if (isQueued[i] > 0)
            {
               col = mixColour(0, fullval, true);
            }
            else if (isRecording[i] > 0)
            {
               col = Colour.RED_FULL;
            }
            else if (isPlaying[i] > 0)
            {
               col = mixColour(0, fullval, false);
            }
            else
            {
               col = mixColour(fullval, fullval, false);
            }
         }

         setCellLED(this.mixerAlignedGrid ? track : scene, this.mixerAlignedGrid ? scene : track, col);
      }
   }
   else if (TEMPMODE == TempMode.TRACK)
   {
      if (this.mixerAlignedGrid == false) {
		  for(var scene=5; scene<8; scene++)
		  {
			 setCellLED(scene, track, Colour.OFF);
		  }

		  if (trackExists[track])
		  {
			 setCellLED(TrackModeColumn.STOP, track, Colour.OFF);
			 setCellLED(TrackModeColumn.SELECT, track, isSelected[track] ?  Colour.GREEN_FLASHING : Colour.GREEN_LOW);
			 setCellLED(TrackModeColumn.ARM, track, arm[track] ? Colour.RED_FULL : Colour.RED_LOW);
			 setCellLED(TrackModeColumn.SOLO, track, solo[track] ? Colour.YELLOW_FULL : Colour.YELLOW_LOW);
			 setCellLED(TrackModeColumn.MUTE, track, mute[track] ? Colour.ORANGE : Colour.AMBER_LOW);
			 setCellLED(TrackModeColumn.RETURN_TO_ARRANGEMENT, track, Colour.OFF);
		  }
		  else
		  {
			 for(var scene=0; scene<5; scene++)
			 {
				setCellLED(scene, track, Colour.OFF);
			 }
		  }
	 }
	 else {
	 		  for(var scene=0; scene<2; scene++)
		  {
			 setCellLED(track, scene, Colour.OFF);
		  }

		  if (trackExists[track])
		  {
			 setCellLED(track, TrackModeColumn.STOP+2, Colour.OFF);
			 setCellLED(track, TrackModeColumn.SELECT+2, isSelected[track] ?  Colour.GREEN_FLASHING : Colour.GREEN_LOW);
			 setCellLED(track, TrackModeColumn.ARM+2, arm[track] ? Colour.RED_FULL : Colour.RED_LOW);
			 setCellLED(track, TrackModeColumn.SOLO+2, solo[track] ? Colour.YELLOW_FULL : Colour.YELLOW_LOW);
			 setCellLED(track, TrackModeColumn.MUTE+2, mute[track] ? Colour.ORANGE : Colour.AMBER_LOW);
			 setCellLED(track, TrackModeColumn.RETURN_TO_ARRANGEMENT+2, Colour.OFF);
		  }
		  else
		  {
			 for(var scene=2; scene<7; scene++)
			 {
				setCellLED(track, scene, Colour.OFF);
			 }
		  }
	 }
   }
   else if (TEMPMODE == TempMode.VOLUME)
   {
      for(var scene=0; scene<8; scene++)
      {
         var c = (volume[track] == scene)
            ? Colour.GREEN_FULL
            : ((vuMeter[track] > scene))
               ? Colour.GREEN_LOW
               : Colour.OFF;

          setCellLED(this.mixerAlignedGrid ? track : scene, this.mixerAlignedGrid ? -Math.abs(scene)+7 : track, c);
      }
   }
   else
   {
      var value = 0;
      var oncolor = Colour.GREEN_FULL;
      var offcolor = Colour.OFF;

      switch (TEMPMODE)
      {
         case TempMode.PAN:
            value = pan[track];
            oncolor = Colour.AMBER_FULL;
            break;

         case TempMode.SEND_A:
            value = sendA[track];
            break;

         case TempMode.SEND_B:
            value = sendB[track];
            break;
      }

      var drawVal = (value > 0) ? (value + 1) : 0;

      for(var scene=0; scene<8; scene++)
      {
          setCellLED(this.mixerAlignedGrid ? track : scene, this.mixerAlignedGrid ? -Math.abs(scene)+7 : track, (scene < drawVal) ? oncolor : offcolor);
      }
   }
};

gridPage.setTempMode = function(mode)
{
   if (mode == TEMPMODE) return;

   TEMPMODE = mode;

   // Update indications in the app
   for(var p=0; p<8; p++)
   {
      var track = trackBank.getTrack(p);
      track.getVolume().setIndication(mode == TempMode.VOLUME);
      track.getPan().setIndication(mode == TempMode.PAN);
      track.getSend(0).setIndication(mode == TempMode.SEND_A);
      track.getSend(1).setIndication(mode == TempMode.SEND_B);
   }
};
